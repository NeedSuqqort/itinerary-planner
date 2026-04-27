import { useState } from 'react';
import { Box, Button, Heading, Stack, Text, useToast } from '@chakra-ui/react';
import TravelInputForm from '../components/forms/TravelInputForm';
import { usePlanGeneration } from '../hooks/usePlanGeneration';
import { usePlan } from '../hooks/usePlan';
import { TravelInputPayload } from '../types';

interface EditPlanProps {
  onOpenSavedPlans: () => void;
}

function EditPlan({ onOpenSavedPlans }: EditPlanProps) {
  const toast = useToast();
  const { plan: currentPlan, save } = usePlan();
  const { plan: generatedPlan } = usePlanGeneration();
  const [draftPlan, setDraftPlan] = useState<TravelInputPayload | null>(null);

  const handleSubmit = async (payload: TravelInputPayload) => {
    setDraftPlan(payload);
    const newPlan = {
      id: crypto.randomUUID(),
      title: `${payload.destination} update`,
      createdAt: new Date().toISOString(),
      itinerary: [],
      ...payload,
    };
    const saved = await save(newPlan);
    if (saved) {
      toast({ title: 'Plan saved locally.', status: 'success', duration: 3000, isClosable: true });
    }
  };

  return (
    <Stack spacing={8}>
      <Box bg="white" p={6} rounded="lg" shadow="sm">
        <Heading size="lg" mb={3}>
          Edit a travel plan
        </Heading>
        <Text color="gray.600" mb={6}>
          Start with an existing plan or generate a new draft, then save updates for later.
        </Text>
        <TravelInputForm onSubmit={handleSubmit} isLoading={false} />
      </Box>

      {currentPlan && (
        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <Heading size="md" mb={3}>
            Last saved plan
          </Heading>
          <Text>{currentPlan.title}</Text>
          <Text color="gray.600" mt={2}>
            {currentPlan.destination} • {currentPlan.travelers} traveler(s)
          </Text>
        </Box>
      )}

      {draftPlan && generatedPlan && (
        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <Heading size="md" mb={3}>
            Generated draft plan
          </Heading>
          <Text>{generatedPlan.title}</Text>
        </Box>
      )}

      <Button
        colorScheme="blue"
        onClick={() => {
          onOpenSavedPlans();
          toast({ title: 'Opening saved plans...', status: 'info', duration: 2000, isClosable: true });
        }}
      >
        Open saved plans
      </Button>
    </Stack>
  );
}

export default EditPlan;
