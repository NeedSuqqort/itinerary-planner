import { render, screen } from '@testing-library/react';
import ItineraryDisplay from './ItineraryDisplay';

const plan = {
  id: 'plan-1',
  title: 'Test Trip',
  destination: 'Reykjavik',
  startDate: '2026-05-01',
  endDate: '2026-05-04',
  travelers: 2,
  interests: ['nature', 'food'],
  itinerary: [
    { day: 1, activities: ['Arrival', 'City walk'] },
    { day: 2, activities: ['Hiking', 'Hot springs'] },
  ],
  createdAt: '2026-04-23T00:00:00.000Z',
};

test('renders itinerary display and export button', () => {
  render(<ItineraryDisplay plan={plan} />);
  expect(screen.getByText(/test trip/i)).toBeInTheDocument();
  expect(screen.getByText(/reykjavik/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /export json/i })).toBeInTheDocument();
});
