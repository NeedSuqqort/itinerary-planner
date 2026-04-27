export type TravelInputPayload = {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  interests: string[];
};

export type ItineraryItem = {
  day: number;
  activities: string[];
  notes?: string;
};

export type TravelPlan = TravelInputPayload & {
  id: string;
  title: string;
  itinerary: ItineraryItem[];
  createdAt: string;
};

export type UpdatePlanPayload = Omit<TravelPlan, 'id' | 'createdAt' | 'title'> & {
  title: string;
};
