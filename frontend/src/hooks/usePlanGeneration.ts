import { useCallback, useState } from 'react';
import { generateItinerary } from '../services/api';
import { TravelInputPayload, TravelPlan } from '../types';

export function usePlanGeneration() {
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (payload: TravelInputPayload) => {
    setError(null);
    setLoading(true);
    try {
      const newPlan = await generateItinerary(payload);
      setPlan(newPlan);
      return newPlan;
    } catch (err) {
      setError('Unable to generate itinerary. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    plan,
    loading,
    error,
    generate,
  };
}
