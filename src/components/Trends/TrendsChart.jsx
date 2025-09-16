import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TrendsChart({ equipment }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/api/trends?equipment=${equipment}&hours=24`)
      .then((res) => res.json())
      .then((json) => setData(json.data || []))
      .catch((err) => console.error("Trend fetch failed", err));
  }, [equipment]);

  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-2">24h Trends - {equipment}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="prediction_time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="avg_temperature" stroke="#ff7300" name="Temperature" />
          <Line type="monotone" dataKey="avg_emissions" stroke="#387908" name="Emissions" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
