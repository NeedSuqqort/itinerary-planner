import { useEffect } from 'react';
import { Box, Heading, Stack, Text, useToast } from '@chakra-ui/react';
import TravelInputForm from '../components/forms/TravelInputForm';
import ItineraryDisplay from '../components/displays/ItineraryDisplay';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import { usePlanGeneration } from '../hooks/usePlanGeneration';
import { TravelInputPayload } from '../types';

function Home() {
  const toast = useToast();
  const { plan, loading, error, generate } = usePlanGeneration();

  useEffect(() => {
    if (error) {
      toast({ title: error, status: 'error', duration: 4000, isClosable: true });
    }
  }, [error, toast]);

  const handleSubmit = async (payload: TravelInputPayload) => {
    await generate(payload);
  };

  return (
    <Stack spacing={8}>
      <Box bg="white" p={6} rounded="lg" shadow="sm">
        <Heading size="lg" mb={3}>
          Build your next trip
        </Heading>
        <Text color="gray.600" mb={6}>
          Share a destination, travel dates, number of travelers, and your interests. We will generate an itinerary you can review and export.
        </Text>
        <TravelInputForm onSubmit={handleSubmit} isLoading={loading} />
      </Box>

      {loading && <LoadingIndicator label="Generating itinerary..." />}

      {plan && (
        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <ItineraryDisplay plan={plan} />
        </Box>
      )}
    </Stack>
  );
}

export default Home;
