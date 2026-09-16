import { notFound } from "next/navigation";

export default async function PublicBioPage({ params }: { params: Promise<{ alias: string }> }) {
  const backendUrl = "https://snaplink-backend-j69v.onrender.com";
  
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
    const themeColor = bioPage.theme_color || "#3B82F6";

    return (
      <div className="min-h-screen" style={{ backgroundColor: themeColor }}>
        {/* Top Header Area */}
        <div className="max-w-xl mx-auto px-4 pt-16 pb-8 text-center text-white">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold shadow-lg">
            {bioPage.title.charAt(0)}
          </div>
          <h1 className="font-extrabold text-2xl tracking-tight mb-2">{bioPage.title}</h1>
          {bioPage.bio_text && <p className="text-white text-opacity-90">{bioPage.bio_text}</p>}
        </div>

        {/* Links Area */}
        <div className="bg-gray-50 min-h-[70vh] rounded-t-[2.5rem] pt-8 px-4 pb-16">
          <div className="max-w-xl mx-auto space-y-4">
            {bioPage.links && bioPage.links.length > 0 ? (
              bioPage.links.map((link: any) => (
                <a 
                  key={link.id} 
                  href={link.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full p-4 bg-white rounded-xl shadow-sm text-center font-bold text-gray-800 hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100"
                >
                  {link.title}
                </a>
              ))
            ) : (
              <p className="text-center text-gray-400">No links added yet.</p>
            )}
            
            <div className="pt-12 text-center">
              <a href="https://snaplinks.in" className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
                Powered by SnapLink
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-8">
        <h2 className="text-xl font-bold text-red-600 mb-4">Error loading page</h2>
        <p className="font-mono bg-white p-4 rounded border text-sm">{error.message || String(error)}</p>
      </div>
    );
  }
}
