"use client";

import React from 'react';

export default function AnalyticsPage() {
  
  // Dummy data for visual layout
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = [45, 52, 38, 65, 89, 75, 95];
  const max = 100;

  return (
    <div className="space-y-6 max-w-6xl">
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Platform Analytics</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-1 flex text-sm font-medium shadow-sm">
          <button className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-900">7D</button>
          <button className="px-3 py-1.5 rounded-md text-gray-500 hover:text-gray-900">30D</button>
          <button className="px-3 py-1.5 rounded-md text-gray-500 hover:text-gray-900">1Y</button>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-1">Total Link Clicks</h3>
          <p className="text-3xl font-black text-gray-900 flex items-center gap-2">
            45,289
            <span className="text-sm font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">
              +14.5%
            </span>
          </p>
        </div>

        <div className="h-64 flex items-end gap-4 pb-4">
          {data.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
              <div className="w-full relative bg-gray-50 rounded-t-lg transition-all duration-300 overflow-hidden h-full flex items-end">
                <div 
                  className="w-full bg-blue-500 rounded-t-lg group-hover:bg-blue-600 transition-all duration-500 relative"
                  style={{ height: `${(val / max) * 100}%` }}
                >
                  {/* Glass highlight effect inside bar */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-400 group-hover:text-gray-900">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Referrers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-gray-900 font-bold">Top Traffic Sources</h3>
          </div>
          <div className="divide-y divide-gray-100 p-2">
            {[
              { source: 'Direct / Unknown', count: '24,194', pct: 53 },
              { source: 'Instagram (Bio)', count: '12,045', pct: 26 },
              { source: 'Twitter / X', count: '5,820', pct: 12 },
              { source: 'Google Search', count: '3,230', pct: 9 },
            ].map((item, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="font-semibold text-gray-700 text-sm">{item.source}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.pct}%` }}></div>
                  </div>
                  <span className="font-mono font-bold text-gray-900 text-sm">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-gray-900 font-bold">Global Distribution</h3>
          </div>
          <div className="divide-y divide-gray-100 p-2">
            {[
              { country: 'India', code: 'IN', count: '18,500' },
              { country: 'United States', code: 'US', count: '12,240' },
              { country: 'United Kingdom', code: 'UK', count: '4,100' },
              { country: 'Germany', code: 'DE', count: '2,900' },
            ].map((item, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-lg bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">
                    {item.code}
                  </span>
                  <span className="font-semibold text-gray-700 text-sm">{item.country}</span>
                </div>
                <span className="font-mono font-bold text-gray-900 text-sm">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
