import { useEffect, useRef, useState } from "react";

export default function useAlertsSocket(url) {
  const [alert, setAlert] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onopen = () => console.log("Alerts WS open");
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "hello") return;
        setAlert(data);
      } catch (err) {
        console.warn("Invalid WS msg", err);
      }
    };
    ws.onclose = () => console.log("Alerts WS closed");
    ws.onerror = (err) => console.error("WS err", err);

    wsRef.current = ws;
    return () => ws.close();
  }, [url]);

  return alert;
}
