import RazorpayCheckout from "@/components/RazorpayCheckout";

export const metadata = {
  title: "Pricing | SnapLink Pro",
  description: "Upgrade to SnapLink Pro for unlimited features.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">Simple Pricing</h1>
          <p className="mt-3 text-slate-400 text-lg">One-time payment for lifetime access.</p>
        </div>
        
        <RazorpayCheckout />
      </div>
    </div>
  );
}
