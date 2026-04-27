import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TravelInputForm from './TravelInputForm';

test('renders TravelInputForm and validates required fields', async () => {
  const submit = jest.fn();
  render(<TravelInputForm onSubmit={submit} />);

  const button = screen.getByRole('button', { name: /generate itinerary/i });
  await userEvent.click(button);

  expect(await screen.findByText(/destination is required/i)).toBeInTheDocument();
  expect(submit).not.toHaveBeenCalled();
});
