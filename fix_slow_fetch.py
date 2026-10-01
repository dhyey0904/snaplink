import re

file = 'frontend/src/app/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

old_func = """async function getRatingSummary() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://snaplink-x8i6.onrender.com';
    const res = await fetch(`${backendUrl}/api/rating/summary`, { next: { revalidate: 3600 } });
    if (!res.ok) return { average: 5.0, count: 1 };
    return await res.json();
  } catch(e) {
    return { average: 5.0, count: 1 };
  }
}"""

new_func = """async function getRatingSummary() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://snaplink-x8i6.onrender.com';
    
    // Create an AbortController to prevent the homepage from hanging if the backend is asleep
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    
    const res = await fetch(`${backendUrl}/api/rating/summary`, { 
      next: { revalidate: 3600 },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    if (!res.ok) return { average: 5.0, count: 1 };
    return await res.json();
  } catch(e) {
    // If it times out or fails, fallback instantly so the page loads blazingly fast
    return { average: 5.0, count: 1 };
  }
}"""

c = c.replace(old_func, new_func)

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Added timeout to fetch")
