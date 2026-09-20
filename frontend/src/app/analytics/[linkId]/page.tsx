"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAPI } from "@/utils/api";
import Link from "next/link";

type AnalyticsData = {
  link_id: number;
  total_clicks: number;
  browsers: Record<string, number>;
  devices: Record<string, number>;
  referrers: Record<string, number>;
};

export default function AnalyticsPage() {
  const { linkId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const result = await fetchAPI(`/analytics/${linkId}`);
        setData(result);
      } catch (err) {
        console.error(err);
        alert("Failed to load analytics");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [linkId, router]);

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading Analytics...</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Link Analytics</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
        </div>

        {/* Top Stat */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col items-center justify-center py-12">
          <span className="text-5xl font-extrabold text-blue-600">{data.total_clicks}</span>
          <span className="text-gray-500 mt-2 font-medium">Total Clicks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Browsers */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Browsers</h3>
            <div className="space-y-4">
              {Object.entries(data.browsers).map(([browser, count]) => (
                <div key={browser}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{browser}</span>
                    <span className="text-gray-500">{count} clicks</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(count / data.total_clicks) * 100}%` }}></div>
                  </div>
                </div>
              ))}
              {Object.keys(data.browsers).length === 0 && <p className="text-gray-500 text-sm">No data yet</p>}
            </div>
          </div>

          {/* Devices */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Devices</h3>
            <div className="space-y-4">
              {Object.entries(data.devices).map(([device, count]) => (
                <div key={device}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{device}</span>
                    <span className="text-gray-500">{count} clicks</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(count / data.total_clicks) * 100}%` }}></div>
                  </div>
                </div>
              ))}
              {Object.keys(data.devices).length === 0 && <p className="text-gray-500 text-sm">No data yet</p>}
            </div>
          </div>
        </div>

        {/* Referrers (Where they come from) */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources (Referrers)</h3>
          <div className="space-y-4">
            {Object.entries(data.referrers).map(([referrer, count]) => (
              <div key={referrer}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 truncate max-w-xs" title={referrer}>{referrer === "Direct" ? "Direct / Unknown" : referrer}</span>
                  <span className="text-gray-500">{count} clicks</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(count / data.total_clicks) * 100}%` }}></div>
                </div>
              </div>
            ))}
            {Object.keys(data.referrers).length === 0 && <p className="text-gray-500 text-sm">No data yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
