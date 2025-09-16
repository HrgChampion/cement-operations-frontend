import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, Factory, Leaf, Activity } from "lucide-react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function KpiDashboard() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKpis() {
      try {
        const res = await fetch("/api/kpis");
        const data = await res.json();
        setKpis(data);
      } catch (err) {
        console.error("Failed to fetch KPIs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchKpis();
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading KPIs...</div>;
  if (!kpis) return <div className="p-8 text-red-500">No data available</div>;

  const trendData = [
    { name: "SEE", value: kpis.energy.see },
    { name: "STE", value: kpis.energy.ste },
    { name: "CO₂", value: kpis.sustainability.co2_per_ton },
    { name: "Blaine", value: kpis.quality.blaine },
    { name: "Residue", value: kpis.quality.residue },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-6">
      {/* Energy Card */}
      <Card className="shadow-lg rounded-2xl border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="text-blue-500" />
            Energy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">SEE: {kpis.energy.see.toFixed(2)} kWh/t</p>
          <p className="text-gray-700">STE: {kpis.energy.ste.toFixed(2)} kcal/kg</p>
        </CardContent>
      </Card>

      {/* Quality Card */}
      <Card className="shadow-lg rounded-2xl border-t-4 border-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-purple-500" />
            Quality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">Blaine: {kpis.quality.blaine.toFixed(1)}</p>
          <p className="text-gray-700">Residue: {kpis.quality.residue.toFixed(2)}%</p>
          <p className="text-gray-700">Out-of-spec: {kpis.quality.out_of_spec_pct.toFixed(1)}%</p>
        </CardContent>
      </Card>

      {/* Sustainability Card */}
      <Card className="shadow-lg rounded-2xl border-t-4 border-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="text-green-500" />
            Sustainability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">CO₂: {kpis.sustainability.co2_per_ton.toFixed(2)} kg/t</p>
        </CardContent>
      </Card>

      {/* Stability Card */}
      <Card className="shadow-lg rounded-2xl border-t-4 border-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="text-orange-500" />
            Stability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">Kiln stops: {kpis.stability.kiln_stops}</p>
          <p className="text-gray-700">Alarm minutes: {kpis.stability.alarm_minutes}</p>
        </CardContent>
      </Card>

      {/* Trend Chart */}
      <div className="col-span-1 md:col-span-2 xl:col-span-4 bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">KPI Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
