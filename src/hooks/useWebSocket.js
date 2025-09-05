import { useEffect, useState } from "react";

export default function useWebSocket(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setData(msg);
      } catch (e) {
        console.error("WS parse error:", e);
      }
    };

    ws.onerror = (err) => console.error("WS error:", err);
    return () => ws.close();
  }, [url]);

  return data;
}
