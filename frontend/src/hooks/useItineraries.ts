import { useCallback, useEffect, useState } from 'react';
import { deletePlan, fetchPlans } from '../services/api';
import { TravelPlan } from '../types';

export function useItineraries() {
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const saved = await fetchPlans();
      setPlans(saved);
    } catch {
      setError('Failed to load saved plans.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const removePlan = useCallback(
    async (planId: string) => {
      setError(null);
      setLoading(true);
      try {
        await deletePlan(planId);
        setPlans((current) => current.filter((item) => item.id !== planId));
      } catch {
        setError('Unable to delete that plan.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    plans,
    loading,
    error,
    refresh: loadPlans,
    removePlan,
  };
}
