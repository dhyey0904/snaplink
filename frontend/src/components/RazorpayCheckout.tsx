"use client";

import { useState } from "react";
import Script from "next/script";

export default function RazorpayCheckout() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setStatus("");
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-x8i6.onrender.com";
      
      // 1. Create order on backend
      const res = await fetch(`${backendUrl}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 99900, currency: "INR", receipt: "receipt_" + Math.random().toString(36).substring(7) }) // 999.00 INR
      });
      
      if (!res.ok) {
        throw new Error("Failed to create order");
      }
      
      const order = await res.json();
      
      // 2. Open Razorpay Checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TeITEkgzaGiCoe",
        amount: order.amount,
        currency: order.currency,
        name: "SnapLink Pro",
        description: "Upgrade to SnapLink Pro (Lifetime)",
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify payment signature on backend
          setStatus("Verifying payment...");
          
          try {
            const verifyRes = await fetch(`${backendUrl}/api/payments/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            
            if (verifyRes.ok) {
              setStatus("Payment Successful! You are now a Pro user.");
            } else {
              setStatus("Payment verification failed.");
            }
          } catch (err) {
            setStatus("Error verifying payment.");
          }
        },
        prefill: {
          name: "SnapLink User",
          email: "user@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3b82f6"
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      
      rzp.on("payment.failed", function (response: any) {
        setStatus(`Payment Failed: ${response.error.description}`);
      });
      
      rzp.open();
    } catch (err: any) {
      setStatus(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800 text-center space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">SnapLink Pro</h2>
        <p className="text-slate-400">Unlock unlimited file size, permanent storage, and custom domains.</p>
      </div>
      
      <div className="text-4xl font-extrabold text-white">
        ₹999 <span className="text-lg text-slate-500 font-normal">/ lifetime</span>
      </div>
      
      <button 
        onClick={handlePayment} 
        disabled={loading}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all disabled:opacity-50"
      >
        {loading ? "Processing..." : "Upgrade to Pro"}
      </button>
      
      {status && (
        <div className={`text-sm p-4 rounded-xl border ${status.includes('Success') ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
          {status}
        </div>
      )}
    </div>
  );
}
