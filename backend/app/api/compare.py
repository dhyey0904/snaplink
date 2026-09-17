import httpx
import asyncio
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel, HttpUrl
from typing import Dict, Any

from app.database.database import get_db
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

class CompareRequest(BaseModel):
    url1: HttpUrl
    url2: HttpUrl

class CategoryScore(BaseModel):
    score1: int
    score2: int
    winner: int # 1, 2, or 0 for tie

class CompareResponse(BaseModel):
    performance: CategoryScore
    accessibility: CategoryScore
    best_practices: CategoryScore
    seo: CategoryScore
    url1_screenshot: str = ""
    url2_screenshot: str = ""
    summary: str = ""

async def fetch_pagespeed(url: str) -> Dict[str, Any]:
    api_url = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    params = {
        "url": url,
        "category": ["performance", "accessibility", "best-practices", "seo"],
        "strategy": "desktop"
    }
    async with httpx.AsyncClient() as client:
        # 40 second timeout as pagespeed can be slow
        response = await client.get(api_url, params=params, timeout=40.0)
        if response.status_code != 200:
            return None
        return response.json()

def extract_score(data: Dict, category: str) -> int:
    try:
        score = data["lighthouseResult"]["categories"][category]["score"]
        return int(score * 100) if score else 0
    except (KeyError, TypeError):
        return 0

@router.post("/", response_model=CompareResponse)
async def compare_websites(
    req: CompareRequest, 
    current_user: User = Depends(get_current_user)
):
    url1_str = str(req.url1)
    url2_str = str(req.url2)
    
    # Run both concurrently
    results = await asyncio.gather(
        fetch_pagespeed(url1_str),
        fetch_pagespeed(url2_str)
    )
    
    data1, data2 = results
    
    if not data1 or not data2:
        raise HTTPException(status_code=400, detail="Failed to fetch analysis for one or both URLs. Make sure they are publicly accessible.")

    categories = {
        "performance": "performance",
        "accessibility": "accessibility",
        "best_practices": "best-practices",
        "seo": "seo"
    }
    
    scores = {}
    wins1 = 0
    wins2 = 0
    
    for key, api_key in categories.items():
        s1 = extract_score(data1, api_key)
        s2 = extract_score(data2, api_key)
        winner = 1 if s1 > s2 else (2 if s2 > s1 else 0)
        if winner == 1: wins1 += 1
        elif winner == 2: wins2 += 1
            
        scores[key] = CategoryScore(score1=s1, score2=s2, winner=winner)

    # Extract screenshots if available
    try: ss1 = data1["lighthouseResult"]["audits"]["final-screenshot"]["details"]["data"]
    except: ss1 = ""
    try: ss2 = data2["lighthouseResult"]["audits"]["final-screenshot"]["details"]["data"]
    except: ss2 = ""

    # Generate summary
    if wins1 > wins2:
        summary = f"Your website won {wins1} categories and beat the competitor overall! Great job."
    elif wins2 > wins1:
        summary = f"The competitor won {wins2} categories. You need to improve your metrics to catch up."
    else:
        summary = "It's a tie! Both websites are performing at a similar level."

    return CompareResponse(
        performance=scores["performance"],
        accessibility=scores["accessibility"],
        best_practices=scores["best_practices"],
        seo=scores["seo"],
        url1_screenshot=ss1,
        url2_screenshot=ss2,
        summary=summary
    )
