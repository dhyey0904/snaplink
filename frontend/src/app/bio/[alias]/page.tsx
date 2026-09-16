import { notFound } from "next/navigation";
import BioPageClient from "./BioPageClient";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function PublicBioPage({ params }: { params: Promise<{ alias: string }> }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://snaplink-backend-j69v.onrender.com";
  
  try {
    const resolvedParams = await params;
    const res = await fetch(`${backendUrl}/api/bio/public/${resolvedParams.alias}`, {
      next: { revalidate: 0 }
    });
    
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`RENDER RETURNED: ${res.status}. URL: ${backendUrl}/api/bio/public/${resolvedParams.alias}. Body: ${text}`);
    }
    
    const bioPage = await res.json();
    return <BioPageClient bioPage={bioPage} />;
  } catch (error: any) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-8">
        <h2 className="text-xl font-bold text-red-600 mb-4">Error loading page</h2>
        <p className="font-mono bg-white p-4 rounded border text-sm">{error.message || String(error)}</p>
      </div>
    );
  }
}
