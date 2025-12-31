import { useState, useEffect, useCallback } from "react";
import { workflowAPI } from "../lib/api";

export const useWorkflowProgress = (orderId, pollInterval = 30000) => {
  const [progress, setProgress] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgress = useCallback(async () => {
    try {
      setError(null);
      const [progressRes, timelineRes, exceptionsRes] = await Promise.all([
        workflowAPI.getProgress(orderId),
        workflowAPI.getTimeline(orderId),
        workflowAPI.getActiveExceptions(orderId),
      ]);

      setProgress(progressRes.data);
      setTimeline(timelineRes.data);
      setExceptions(exceptionsRes.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching workflow progress:", err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchProgress();
    const interval = setInterval(fetchProgress, pollInterval);
    return () => clearInterval(interval);
  }, [orderId, pollInterval, fetchProgress]);

  return {
    progress,
    timeline,
    exceptions,
    loading,
    error,
    refetch: fetchProgress,
  };
};

export default useWorkflowProgress;
