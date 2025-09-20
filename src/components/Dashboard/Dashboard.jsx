import React, { useEffect, useMemo, useState } from "react";
import useWebSocket from "../../hooks/useWebSocket";
import { fetchPredictions } from "../../utils/api";
import {
  Grid, Card, CardContent, Typography, Box, Table, TableHead, TableRow,
  TableCell, TableBody, Chip, Divider, LinearProgress, IconButton
} from "@mui/material";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import { fmt, fmtShort } from "../../utils/format";
import { RefreshCw } from 'lucide-react';
import toast from "react-hot-toast";
import TrendsChart from "../Trends/TrendsChart";
import useAlertsSocket from "../../hooks/useAlertSocket";

const WS_URL =  "wss://cement-operations-backend-594125598497.asia-south1.run.app/ws/data";

export default function Dashboard() {
  const wsData = useWebSocket(WS_URL);
  const [records, setRecords] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loadingPred, setLoadingPred] = useState(false);

  const alert = useAlertsSocket("wss://cement-operations-backend-594125598497.asia-south1.run.app/ws/alerts");

  useEffect(() => {
    if (alert) {
      toast.error(
        `⚠️ Anomaly on ${alert.equipment} (prob: ${(alert.prob * 100).toFixed(1)}%)`
      );
    }
  }, [alert]);

  // Log when WebSocket connection is open for wsData
  useEffect(() => {
    if (wsData) {
      console.log("WebSocket connection for wsData is open.");
    }
  }, [wsData]);

  // normalize and push incoming WS record
  useEffect(() => {
    if (!wsData) return;
    const normalized = {
      ...wsData,
      // support both .metrics.* and top-level keys
      temperature: wsData.metrics?.temperature ?? wsData.temperature ?? null,
      emissions: wsData.metrics?.emissions ?? wsData.emissions ?? wsData.emission ?? null,
      power: wsData.metrics?.power ?? wsData.power ?? null,
      vibration: wsData.metrics?.vibration ?? wsData.vibration ?? null,
      pressure: wsData.metrics?.pressure ?? wsData.pressure ?? null,
      fineness: wsData.metrics?.fineness ?? wsData.fineness ?? null,
      residue: wsData.metrics?.residue ?? wsData.residue ?? null,
      timestamp: wsData.timestamp ?? new Date().toISOString(),
    };
    setRecords(prev => {
      const next = [...prev.slice(-199), normalized]; // keep 200
      return next;
    });
  }, [wsData]);

  // Load predictions periodically
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoadingPred(true);
        const res = await fetchPredictions(25);
        if (!mounted) return;
        setPredictions(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPred(false);
      }
    }
    load();
    const t = setInterval(load, 30_000); // refresh every 30s
    return () => { mounted = false; clearInterval(t); };
  }, []);

  const latest = records.length ? records[records.length - 1] : {};

  // prepare chart data (convert timestamp to readable label)
  const chartData = useMemo(() => {
    return records.map(r => ({
      timestamp: (new Date(r.timestamp)).toLocaleTimeString(),
      temperature: r.temperature ? Number(r.temperature.toFixed(2)) : null,
      emissions: r.emissions ? Number(r.emissions.toFixed(2)) : null,
      power: r.power ? Number(r.power.toFixed(2)) : null,
      vibration: r.vibration ? Number(r.vibration.toFixed(2)) : null,
    }));
  }, [records]);

  // KPI items
  const kpis = [
    { label: "🔥 Temp (C)", value: latest.temperature },
    { label: "🌍 Emissions (mg/Nm³)", value: latest.emissions },
    { label: "⚡ Power (kW)", value: latest.power },
    { label: "📉 Pressure (bar)", value: latest.pressure },
    { label: "📈 Vibration (mm/s)", value: latest.vibration },
    { label: "🎯 Fineness (m²/kg)", value: latest.fineness },
    { label: "🧪 Residue (%)", value: latest.residue },
    { label: "⚠️ Anomaly", value: latest.anomaly ? "Yes" : "No" },
  ];

  return (
    <Box sx={{ p: 4, minHeight: "100vh", background: "linear-gradient(135deg,#667eea,#764ba2)" }}>
      <Typography variant="h3" sx={{ mb: 3, color: "white", fontWeight: "700", textAlign: "center" }}>
        🏭 Cement Plant Operations Dashboard
      </Typography>

      {/* KPI Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpis.map((kpi, i) => (
          <Grid key={kpi.label} item xs={12} sm={6} md={3}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Card sx={{ borderRadius: 3, background: "rgba(255,255,255,0.08)", color: "white" }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>{kpi.label}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {typeof kpi.value === "number" ? fmt(kpi.value, 2) : kpi.value ?? "--"}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Charts + Prediction Panel */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>🔥 Temp & 🌍 Emissions Trends</Typography>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="emissions" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="h6">🔮 Recent Predictions</Typography>
                <IconButton onClick={async () => {
                  setLoadingPred(true);
                  const data = await fetchPredictions(20).catch(console.error);
                  if (data) setPredictions(data);
                  setLoadingPred(false);
                }}>
                  <RefreshCw sx={{ color: "inherit" }} />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Box sx={{ maxHeight: 260, overflowY: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Time</TableCell>
                      <TableCell>Equip</TableCell>
                      <TableCell>Prob</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {predictions.length === 0 && (
                      <TableRow><TableCell colSpan={3}>No predictions</TableCell></TableRow>
                    )}
                    {predictions.map((p, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{ new Date(p.prediction_time).toLocaleString() }</TableCell>
                        <TableCell>{ p.equipment }</TableCell>
                        <TableCell>
                          <Chip label={ (Number(p.anomaly_prob || p.prob || 0)).toFixed(2) } color={ (Number(p.anomaly_prob || 0) > 0.8) ? "error" : "default" } />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Power Card - now wider */}
        <Grid item xs={12} md={6} lg={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">⚡ Power</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="power" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Vibration Card - now wider */}
        <Grid item xs={12} md={6} lg={6}>
          <Card sx={{ borderRadius: 3,width:"200px" }}>
            <CardContent>
              <Typography variant="h6">📈 Vibration</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="vibration" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Anomalies (clickable) */}
      <Box sx={{ mt: 3 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6">⚠️ Recent Anomalies (stream)</Typography>
            <Divider sx={{ mb: 2 }} />
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Equipment</TableCell>
                  <TableCell>Anomaly</TableCell>
                  <TableCell>Temp</TableCell>
                  <TableCell>Emissions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.filter(r => r.anomaly).slice(-10).reverse().map((row, i) => (
                  <TableRow key={i} sx={{ backgroundColor: "rgba(255,0,0,0.06)" }}>
                    <TableCell>{ new Date(row.timestamp).toLocaleString() }</TableCell>
                    <TableCell>{ row.equipment }</TableCell>
                    <TableCell><Chip label={row.anomaly_type || "anomaly"} color="error" size="small" /></TableCell>
                    <TableCell>{ row.temperature !== undefined ? fmt(row.temperature, 2) : "--" }</TableCell>
                    <TableCell>{ row.emissions !== undefined ? fmt(row.emissions, 2) : "--" }</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>

      <TrendsChart equipment="kiln" />
      <TrendsChart equipment="mill" />
    </Box>
  );
}
