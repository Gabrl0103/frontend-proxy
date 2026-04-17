import { useState, useEffect, useRef } from 'react';

/**
 * Maneja el countdown cuando se supera el rate limit.
 * Recibe los segundos de "Retry-After" del header y cuenta regresivamente.
 */
export function useRateLimitCountdown() {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef(null);

  const isBlocked = secondsLeft > 0;

  const startCountdown = (seconds) => {
    clearInterval(timerRef.current);
    setSecondsLeft(seconds);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return { secondsLeft, isBlocked, startCountdown };
}
