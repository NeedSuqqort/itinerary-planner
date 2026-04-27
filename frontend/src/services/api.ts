import axios from 'axios';
import { TravelInputPayload, TravelPlan, UpdatePlanPayload } from '../types';

const apiUrl = import.meta.env.VITE_API_URL?.trim() ?? '';
const client = axios.create({
  baseURL: apiUrl,
  timeout: 12000,
});

const LOCAL_STORAGE_KEY = 'itinerary-planner:saved-plans';

function getLocalPlans(): TravelPlan[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TravelPlan[]) : [];
  } catch {
    return [];
  }
}

function persistLocalPlans(plans: TravelPlan[]) {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plans));
}

function createMockPlan(payload: TravelInputPayload): TravelPlan {
  const baseDate = new Date(payload.startDate);
  const itinerary = Array.from({ length: 3 }, (_, index) => {
    const day = new Date(baseDate);
    day.setDate(baseDate.getDate() + index);
    return {
      day: index + 1,
      activities: [
        `Explore ${payload.destination} highlights`,
        `Enjoy local cuisine with a focus on ${payload.interests.join(', ')}`,
        'Build an adaptable travel rhythm that works for your group',
      ],
      notes: `Plan for ${payload.travelers} traveler${payload.travelers === 1 ? '' : 's'} and stay flexible.`,
    };
  });

  return {
    id: crypto.randomUUID(),
    title: `${payload.destination} adventure`,
    createdAt: new Date().toISOString(),
    itinerary,
    ...payload,
  };
}

export async function generateItinerary(payload: TravelInputPayload): Promise<TravelPlan> {
  if (!apiUrl) {
    return Promise.resolve(createMockPlan(payload));
  }

  const response = await client.post<TravelPlan>('/plans/generate', payload);
  return response.data;
}

export async function fetchPlans(): Promise<TravelPlan[]> {
  if (!apiUrl) {
    return Promise.resolve(getLocalPlans());
  }

  const response = await client.get<TravelPlan[]>('/plans');
  return response.data;
}

export async function savePlan(plan: TravelPlan): Promise<TravelPlan> {
  if (!apiUrl) {
    const plans = getLocalPlans();
    const existingIndex = plans.findIndex((item) => item.id === plan.id);
    if (existingIndex >= 0) {
      plans[existingIndex] = plan;
    } else {
      plans.unshift(plan);
    }
    persistLocalPlans(plans);
    return Promise.resolve(plan);
  }

  const response = await client.post<TravelPlan>('/plans', plan);
  return response.data;
}

export async function updatePlan(plan: UpdatePlanPayload & { id: string }): Promise<TravelPlan> {
  if (!apiUrl) {
    const plans = getLocalPlans();
    const index = plans.findIndex((item) => item.id === plan.id);
    const updated: TravelPlan = {
      ...plans[index],
      ...plan,
      id: plan.id,
      createdAt: plans[index]?.createdAt ?? new Date().toISOString(),
    };
    plans[index] = updated;
    persistLocalPlans(plans);
    return Promise.resolve(updated);
  }

  const response = await client.put<TravelPlan>(`/plans/${plan.id}`, plan);
  return response.data;
}

export async function deletePlan(planId: string): Promise<void> {
  if (!apiUrl) {
    const plans = getLocalPlans().filter((item) => item.id !== planId);
    persistLocalPlans(plans);
    return Promise.resolve();
  }

  await client.delete(`/plans/${planId}`);
}
