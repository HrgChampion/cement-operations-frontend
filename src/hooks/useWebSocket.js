import { useEffect, useRef, useState } from "react";

export default function useWebSocket(url) {
  const wsRef = useRef(null);
  const [message, setMessage] = useState(null);
  const reconnectRef = useRef(0);

  useEffect(() => {
    if (!url) return;

    let mounted = true;
    let timeoutId = null;

    function connect() {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        reconnectRef.current = 0;
        // console.log("WS connected", url);
      };

      wsRef.current.onmessage = (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          if (mounted) setMessage(payload);
        } catch (e) {
          // non-json message
          if (mounted) setMessage(ev.data);
        }
      };

      wsRef.current.onclose = () => {
        // exponential backoff retry
        reconnectRef.current = Math.min(30, reconnectRef.current + 1);
        const delay = Math.min(30000, 1000 * 2 ** reconnectRef.current);
        timeoutId = setTimeout(connect, delay);
      };

      wsRef.current.onerror = () => {
        try { wsRef.current.close(); } catch {}
      };
    }

    connect();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      try { wsRef.current.close(); } catch {}
    };
  }, [url]);

  return message;
}
