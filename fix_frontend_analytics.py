import re

with open("frontend/src/app/dashboard/analytics/[linkId]/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Update the AnalyticsData type
pattern_type = r'''type AnalyticsData = \{
  link_id: number;
  total_clicks: number;
  browsers: Record<string, number>;
  devices: Record<string, number>;
  referrers: Record<string, number>;
  daily_clicks: \{ date: string, clicks: number \}\[\];
\};'''

replacement_type = '''type AnalyticsData = {
  link_id: number;
  total_clicks: number;
  browsers: Record<string, number>;
  devices: Record<string, number>;
  referrers: Record<string, number>;
  countries: Record<string, number>;
  cities: Record<string, number>;
  daily_clicks: { date: string, clicks: number }[];
};'''

content = re.sub(pattern_type, replacement_type, content)

# Extract country data for recharts
pattern_data = r'''const referrerData = Object\.entries\(data\.referrers\)\.map\(\(\[name, value\]\) => \(\{ name, value \}\)\)\.sort\(\(a, b\) => b\.value - a\.value\)\.slice\(0, 5\);'''

replacement_data = '''const referrerData = Object.entries(data.referrers).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
  const countryData = Object.entries(data.countries || {}).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);'''

content = re.sub(pattern_data, replacement_data, content)

# Add the Top Country KPI
pattern_kpi = r'''<div className="bg-white rounded-2xl p-6 border border-\[#dadce0\] shadow-sm">
            <h3 className="text-sm font-medium text-\[#5f6368\] mb-2">Top Referrer</h3>
            <div className="text-2xl font-bold text-\[#202124\]">\{referrerData\.length > 0 \? referrerData\[0\]\.name : "N/A"\}</div>
          </div>'''

replacement_kpi = '''<div className="bg-white rounded-2xl p-6 border border-[#dadce0] shadow-sm">
            <h3 className="text-sm font-medium text-[#5f6368] mb-2">Top Referrer</h3>
            <div className="text-2xl font-bold text-[#202124]">{referrerData.length > 0 ? referrerData[0].name : "N/A"}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#dadce0] shadow-sm">
            <h3 className="text-sm font-medium text-[#5f6368] mb-2">Top Country</h3>
            <div className="text-2xl font-bold text-[#202124]">{countryData.length > 0 && countryData[0].name !== "Unknown" ? countryData[0].name : (countryData.length > 1 ? countryData[1].name : "N/A")}</div>
          </div>'''

content = re.sub(pattern_kpi, replacement_kpi, content)

# Update the grid cols for KPI
content = content.replace('className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"', 'className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"')


# Add the Geography Box in the Row 2 grid
pattern_charts = r'''<div className="bg-white rounded-2xl p-6 border border-\[#dadce0\] shadow-sm">
            <h3 className="text-lg font-bold text-\[#202124\] mb-6">Devices & Browsers</h3>'''

replacement_charts = '''<div className="bg-white rounded-2xl p-6 border border-[#dadce0] shadow-sm">
            <h3 className="text-lg font-bold text-[#202124] mb-6">Top Countries</h3>
            {countryData.length > 0 ? (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryData} layout="vertical" margin={{top: 0, right: 0, left: 20, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f3f4" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#202124', fontSize: 13, fontWeight: 500}} width={100} />
                    <Tooltip cursor={{fill: '#f8f9fa'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                      {countryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-[#5f6368]">No location data available.</div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#dadce0] shadow-sm">
            <h3 className="text-lg font-bold text-[#202124] mb-6">Devices & Browsers</h3>'''

content = re.sub(pattern_charts, replacement_charts, content)

# Update the grid cols for Row 2
content = content.replace('className="grid grid-cols-1 lg:grid-cols-2 gap-8"', 'className="grid grid-cols-1 lg:grid-cols-3 gap-8"')

with open("frontend/src/app/dashboard/analytics/[linkId]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
