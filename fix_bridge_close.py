import re

with open('frontend/src/app/b/[shortCode]/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add a closeRoom function to the frontend
close_room_func = """
  const closeRoom = async () => {
    if (!confirm("Are you sure you want to permanently destroy this room and delete all files inside it?")) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      await fetch(`${apiUrl}/bridge/room/${shortCode}`, { method: 'DELETE' });
      setError("Room closed by user.");
    } catch(e) {
      console.error("Failed to close room");
    }
  };

  const roomUrl = typeof window !== 'undefined' ? window.location.href : '';
"""

c = c.replace("const roomUrl = typeof window !== 'undefined' ? window.location.href : '';", close_room_func)

# Add the button next to "Show QR Code"
old_buttons = """<button onClick={() => setShowQR(true)} className="bg-white border border-gray-200 shadow-sm text-gray-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <QrCode size={18} /> Show QR Code
          </button>"""

new_buttons = """<div className="flex items-center gap-3">
            <button onClick={() => setShowQR(true)} className="bg-white border border-gray-200 shadow-sm text-gray-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <QrCode size={18} /> Show QR Code
            </button>
            <button onClick={closeRoom} className="bg-red-50 border border-red-200 shadow-sm text-red-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-100 transition-colors">
              <X size={18} /> Close Room
            </button>
          </div>"""

c = c.replace(old_buttons, new_buttons)

with open('frontend/src/app/b/[shortCode]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Injected Close Room button")
