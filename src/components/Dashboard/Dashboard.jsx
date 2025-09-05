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
      };
      setRecords((prev) => [...prev.slice(-50), normalized]); // keep last 50
    }
  }, [wsData]);

  const latest = records[records.length - 1] || {};

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
        <Grid item xs={12} md={3}>
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
                <Typography variant="h6">🔥 Temp</Typography>
                <Typography variant="h4">
                  {latest.temperature ?? "--"} °C
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={3}>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Card
              sx={{
                borderRadius: 4,
                backdropFilter: "blur(12px)",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                textAlign: "center",
              }}
            >
              <CardContent>
                <Typography variant="h6">🌍 Emissions</Typography>
                <Typography variant="h4">
                  {latest.emissions ?? "--"} mg/Nm³
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={3}>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Card
              sx={{
                borderRadius: 4,
                backdropFilter: "blur(12px)",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                textAlign: "center",
              }}
            >
              <CardContent>
                <Typography variant="h6">⚡ Power</Typography>
                <Typography variant="h4">
                  {latest.metrics?.power ?? "--"} kW
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={3}>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Card
              sx={{
                borderRadius: 4,
                backdropFilter: "blur(12px)",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                textAlign: "center",
              }}
            >
              <CardContent>
                <Typography variant="h6">⚠️ Anomaly</Typography>
                <Typography variant="h4">
                  {latest.anomaly ? "Yes" : "No"}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
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
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="url(#tempGradient)"
                    strokeWidth={3}
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
                  <defs>
                    <linearGradient id="emissionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="emissions"
                    stroke="url(#emissionGradient)"
                    strokeWidth={3}
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
    </Box>
  );
}
