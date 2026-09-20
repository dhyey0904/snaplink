from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import razorpay
import os
import hmac
import hashlib

router = APIRouter()

RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID", "rzp_test_TeIxxkdctC2mH1")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "GUlLwr97ni1XZ8cfDoo0Ik6C")

try:
    client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
except Exception as e:
    client = None

class CreateOrderRequest(BaseModel):
    amount: int # Amount in paise (minimum 100)
    currency: str = "INR"
    receipt: str = "receipt_1"

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/create-order")
def create_order(request: CreateOrderRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Razorpay client not configured.")
    if request.amount < 100:
        raise HTTPException(status_code=400, detail="Minimum amount is 100 paise.")
        
    try:
        data = {
            "amount": request.amount,
            "currency": request.currency,
            "receipt": request.receipt,
            "payment_capture": 1 # Auto capture
        }
        order = client.order.create(data=data)
        return order
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-payment")
def verify_payment(request: VerifyPaymentRequest):
    try:
        # Verify signature using HMAC-SHA256
        msg = f"{request.razorpay_order_id}|{request.razorpay_payment_id}"
        generated_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode(),
            msg.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature == request.razorpay_signature:
            # Here you would typically mark the user as Pro in the database
            return {"status": "success", "message": "Payment verified successfully"}
        else:
            raise HTTPException(status_code=400, detail="Signature mismatch")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Verification failed: " + str(e))
