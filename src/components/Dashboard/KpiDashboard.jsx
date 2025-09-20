import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { TrendingUp, Factory, Leaf, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchKpis } from "../../utils/api";

export default function KpiDashboard() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadKpis() {
      try {
        const data = await fetchKpis();
        setKpis(data);
      } catch (err) {
        console.error("Failed to fetch KPIs:", err);
        setError("Failed to load KPI data");
      } finally {
        setLoading(false);
      }
    }
    loadKpis();
  }, []);

  // Helper to safely format numbers or fallback to static values
  const safeNumber = (value, fallback, digits = 2) =>
    value == null ? fallback : Number(value).toFixed(digits);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
          Loading KPIs...
        </Typography>
      </Box>
    );

  if (!kpis)
    return (
      <Box p={4}>
        <Typography color="error">No data available</Typography>
      </Box>
    );

  const trendData = [
    { name: "SEE", value: kpis.energy.see ?? 50 },
    { name: "STE", value: kpis.energy.ste ?? 700 },
    { name: "CO₂", value: kpis.sustainability.co2_per_ton ?? 800 },
    { name: "Blaine", value: kpis.quality.blaine ?? 3200 },
    { name: "Residue", value: kpis.quality.residue ?? 2.5 },
  ];

  const cardStyles = (color) => ({
    borderTop: `4px solid ${color}`,
    borderRadius: 2,
    boxShadow: 3,
    height: "100%",
  });

  return (
    <Grid container spacing={3} p={3}>
      {/* Energy Card */}
      <Grid item xs={12} md={6} lg={3}>
        <Card sx={cardStyles("#3b82f6")}>
          <CardHeader
            avatar={<Factory color="#3b82f6" />}
            title={
              <Typography variant="h6" fontWeight="bold">
                Energy
              </Typography>
            }
          />
          <CardContent>
            <Typography color="text.secondary">
              SEE: {safeNumber(kpis.energy.see, "50.00")} kWh/t
            </Typography>
            <Typography color="text.secondary">
              STE: {safeNumber(kpis.energy.ste, "700.00")} kcal/kg
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Quality Card */}
      <Grid item xs={12} md={6} lg={3}>
        <Card sx={cardStyles("#8b5cf6")}>
          <CardHeader
            avatar={<TrendingUp color="#8b5cf6" />}
            title={
              <Typography variant="h6" fontWeight="bold">
                Quality
              </Typography>
            }
          />
          <CardContent>
            <Typography color="text.secondary">
              Blaine: {safeNumber(kpis.quality.blaine, "3200.0", 1)}
            </Typography>
            <Typography color="text.secondary">
              Residue: {safeNumber(kpis.quality.residue, "2.50")}%
            </Typography>
            <Typography color="text.secondary">
              Out-of-spec: {safeNumber(kpis.quality.out_of_spec_pct, "0.0", 1)}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Sustainability Card */}
      <Grid item xs={12} md={6} lg={3}>
        <Card sx={cardStyles("#22c55e")}>
          <CardHeader
            avatar={<Leaf color="#22c55e" />}
            title={
              <Typography variant="h6" fontWeight="bold">
                Sustainability
              </Typography>
            }
          />
          <CardContent>
            <Typography color="text.secondary">
              CO₂: {safeNumber(kpis.sustainability.co2_per_ton, "800.00")} kg/t
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Stability Card */}
      <Grid item xs={12} md={6} lg={3}>
        <Card sx={cardStyles("#f97316")}>
          <CardHeader
            avatar={<Activity color="#f97316" />}
            title={
              <Typography variant="h6" fontWeight="bold">
                Stability
              </Typography>
            }
          />
          <CardContent>
            <Typography color="text.secondary">
              Kiln stops: {kpis.stability.kiln_stops}
            </Typography>
            <Typography color="text.secondary">
              Alarm minutes: {kpis.stability.alarm_minutes}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Trend Chart */}
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              KPI Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4f46e5"
                  fill="#6366f1"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
