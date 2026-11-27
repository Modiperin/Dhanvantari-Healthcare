import { useState, useEffect } from "react";

export function useCountdown(durationInSeconds = 300, active = false) {
  const [remaining, setRemaining] = useState(durationInSeconds);

  useEffect(() => {
    if (!active) {
      setRemaining(durationInSeconds); // reset timer if not active
      return;
    }

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // cleanup on unmount or step change
  }, [active, durationInSeconds]);

  // Format MM:SS
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  const formatted = `${minutes}:${seconds}`;

  return { remaining, formatted };
}
