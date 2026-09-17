import razorpay
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os
from typing import Any

from app.database.database import get_db
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()

# Default to test keys if not provided in environment
RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID", "rzp_test_placeholder")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "secret_placeholder")

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

class PaymentVerification(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str

@router.post("/create-order")
def create_order(
    current_user: User = Depends(get_current_user)
) -> Any:
    # 199 Rs = 19900 paise
    amount = 19900
    currency = "INR"
    
    try:
        # Create an order in Razorpay
        order = client.order.create({
            "amount": amount,
            "currency": currency,
            "receipt": f"receipt_{current_user.id}",
            "notes": {
                "user_id": current_user.id,
                "email": current_user.email,
                "type": "api_pro_lifetime"
            }
        })
        
        return {
            "order_id": order["id"],
            "amount": amount,
            "currency": currency,
            "key_id": RAZORPAY_KEY_ID
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify")
def verify_payment(
    data: PaymentVerification,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    try:
        # Verify the signature from Razorpay
        client.utility.verify_payment_signature({
            'razorpay_order_id': data.razorpay_order_id,
            'razorpay_payment_id': data.razorpay_payment_id,
            'razorpay_signature': data.razorpay_signature
        })
        
        # Payment is valid! Upgrade the user!
        current_user.tier = "pro"
        db.commit()
        
        return {"status": "success", "message": "API unlocked successfully!"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Signature verification failed.")
