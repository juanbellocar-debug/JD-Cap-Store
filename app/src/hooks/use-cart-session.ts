import { useState, useEffect } from "react";

export function useCartSession() {
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    let id = localStorage.getItem("killers_stars_session_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("killers_stars_session_id", id);
    }
    setSessionId(id);
  }, []);

  return sessionId;
}
