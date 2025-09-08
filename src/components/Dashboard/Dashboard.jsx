import React, { useState, useEffect } from "react";
import useWebSocket from "../../hooks/useWebSocket";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Divider,
  LinearProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const wsData = useWebSocket("ws://localhost:8000/ws/data");
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (wsData) {
      const normalized = {
        ...wsData,
        temperature: wsData.metrics?.temperature,
        emissions: wsData.metrics?.emissions,
        power: wsData.metrics?.power,
        vibration: wsData.metrics?.vibration,
        pressure: wsData.metrics?.pressure,
        fineness: wsData.metrics?.fineness,
        residue: wsData.metrics?.residue,
      };
      setRecords((prev) => [...prev.slice(-100), normalized]); // keep last 100
    }
  }, [wsData]);

  const latest = records[records.length - 1] || {};

  // helper to fix decimals
  const formatValue = (val, unit = "") =>
    val !== undefined && val !== null && !isNaN(val)
      ? `${Number(val).toFixed(2)} ${unit}`
      : "--";

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <Typography
        variant="h3"
        sx={{ mb: 4, color: "white", fontWeight: "bold", textAlign: "center" }}
      >
        🏭 Cement Plant Operations Dashboard
      </Typography>

      {/* KPI Tiles */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "🔥 Temp", value: formatValue(latest.temperature, "°C") },
          {
            label: "🌍 Emissions",
            value: formatValue(latest.emissions, "mg/Nm³"),
          },
          { label: "⚡ Power", value: formatValue(latest.power, "kW") },
          { label: "📉 Pressure", value: formatValue(latest.pressure, "bar") },
          {
            label: "📈 Vibration",
            value: formatValue(latest.vibration, "mm/s"),
          },
          {
            label: "🎯 Fineness",
            value: formatValue(latest.fineness, "m²/kg"),
          },
          { label: "🧪 Residue", value: formatValue(latest.residue, "%") },
          { label: "⚠️ Anomaly", value: latest.anomaly ? "Yes" : "No" },
        ].map((kpi, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  backdropFilter: "blur(12px)",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  textAlign: "center",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                <CardContent>
                  <Typography variant="h6">{kpi.label}</Typography>
                  <Typography variant="h4">{kpi.value}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={4}>
        {/* Temperature */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, backdropFilter: "blur(8px)" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🔥 Temperature Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={records}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis />
                  <Tooltip formatter={(val) => formatValue(val, "°C")} />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Emissions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, backdropFilter: "blur(8px)" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🌍 Emissions Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={records}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis />
                  <Tooltip formatter={(val) => formatValue(val, "mg/Nm³")} />
                  <Line
                    type="monotone"
                    dataKey="emissions"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Power */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, backdropFilter: "blur(8px)" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ⚡ Power Consumption
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={records}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis />
                  <Tooltip formatter={(val) => formatValue(val, "kW")} />
                  <Line
                    type="monotone"
                    dataKey="power"
                    stroke="#facc15"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Vibration */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, backdropFilter: "blur(8px)" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Vibration Monitoring
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={records}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis />
                  <Tooltip formatter={(val) => formatValue(val, "mm/s")} />
                  <Line
                    type="monotone"
                    dataKey="vibration"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Anomalies Table */}
      <Grid item xs={12} sx={{ mt: 4 }}>
        <Card sx={{ borderRadius: 4, backdropFilter: "blur(10px)" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ⚠️ Recent Anomalies
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Timestamp</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Equipment</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Anomaly Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records
                  .filter((r) => r.anomaly)
                  .slice(-10)
                  .map((row, i) => (
                    <TableRow
                      key={i}
                      sx={{ backgroundColor: "rgba(255,0,0,0.1)" }}
                    >
                      <TableCell>{row.timestamp}</TableCell>
                      <TableCell>{row.equipment}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.anomaly_type}
                          color="error"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>

      {/* Live Plant Status */}
      <Grid item xs={12} sx={{ mt: 4 }}>
        <Card sx={{ borderRadius: 4, backdropFilter: "blur(10px)" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🚦 Live Plant Status
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Active Equipment: {latest.equipment || "Unknown"}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={latest.anomaly ? 90 : 30}
              sx={{
                height: 12,
                borderRadius: 5,
                backgroundColor: "rgba(255,255,255,0.2)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: latest.anomaly ? "#dc2626" : "#16a34a",
                },
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
}
