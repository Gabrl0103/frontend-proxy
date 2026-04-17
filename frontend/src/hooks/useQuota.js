import { useState, useEffect, useCallback, useRef } from 'react';
import { getQuotaStatus, getQuotaHistory } from '../services/api';

const DEFAULT_USER = import.meta.env.VITE_DEFAULT_USER_ID || 'default-user';
const POLL_INTERVAL = 5000; // 5s de polling para actualizar estado

export function useQuota(userId = DEFAULT_USER) {
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await getQuotaStatus(userId);
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [userId]);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await getQuotaHistory(userId);
      setHistory(data.history || []);
    } catch (_) {
      // historial no crítico
    }
  }, [userId]);

  const refresh = useCallback(async () => {
    await Promise.all([fetchStatus(), fetchHistory()]);
  }, [fetchStatus, fetchHistory]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    };
    init();

    intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [refresh, fetchStatus]);

  return { status, history, loading, error, refresh };
}
