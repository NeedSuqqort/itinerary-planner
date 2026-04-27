import { useCallback, useState } from 'react';
import { savePlan, updatePlan } from '../services/api';
import { TravelPlan, UpdatePlanPayload } from '../types';

export function usePlan() {
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(async (newPlan: TravelPlan) => {
    setLoading(true);
    setError(null);
    try {
      const savedPlan = await savePlan(newPlan);
      setPlan(savedPlan);
      return savedPlan;
    } catch {
      setError('Unable to save the plan.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (payload: UpdatePlanPayload & { id: string }) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPlan = await updatePlan(payload);
      setPlan(updatedPlan);
      return updatedPlan;
    } catch {
      setError('Unable to update the plan.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    plan,
    loading,
    error,
    save,
    update,
    setPlan,
  };
}
