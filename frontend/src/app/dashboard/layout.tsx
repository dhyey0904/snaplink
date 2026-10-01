"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Strict Admin Panel separation: Admins use /admin, regular users use /dashboard
      if (payload && payload.sub === 'hello.snaplinks@gmail.com') {
        router.replace('/admin');
        return;
      }
      
      setAuthorized(true);
    } catch (e) {
      localStorage.removeItem("token");
      router.replace("/login");
    }
  }, [router]);

  if (!authorized) {
    return <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>;
  }

  return <>{children}</>;
}
