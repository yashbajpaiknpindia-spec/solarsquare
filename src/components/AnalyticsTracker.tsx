import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Generates or retrieves a persistent session ID stored in sessionStorage.
 */
function getSessionId(): string {
  const key = "sg_sid";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid =
      Math.random().toString(36).slice(2) +
      Math.random().toString(36).slice(2) +
      Date.now().toString(36);
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

const API_BASE = "/api/analytics";

export function AnalyticsTracker() {
  const location = useLocation();
  const startTimeRef = useRef<number>(Date.now());
  const sessionId = useRef<string>(getSessionId());

  // Track a page view
  useEffect(() => {
    startTimeRef.current = Date.now();
    const sid = sessionId.current;
    const page = location.pathname + location.search;
    const referrer = document.referrer || "";

    fetch(`${API_BASE}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sid,
        page,
        referrer,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
      }),
      // Use keepalive so request survives page unload
      keepalive: true,
    }).catch(() => {
      // Silently ignore tracking errors
    });
  }, [location.pathname, location.search]);

  // Send duration on page hide / unload
  useEffect(() => {
    const sid = sessionId.current;

    function sendDuration() {
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (elapsed < 1) return;
      navigator.sendBeacon(
        `${API_BASE}/track/${sid}/duration`,
        JSON.stringify({ duration_sec: elapsed })
      );
    }

    // Use visibilitychange for more reliable detection
    function onVisibilityChange() {
      if (document.visibilityState === "hidden") sendDuration();
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", sendDuration);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", sendDuration);
    };
  }, []);

  // Component renders nothing
  return null;
}
