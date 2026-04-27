import { useEffect, useState } from 'react';
import { Box, Heading, Stack, Text, useToast } from '@chakra-ui/react';
import PlansList from '../components/displays/PlansList';
import PlanEditor from '../components/displays/PlanEditor';
import { useItineraries } from '../hooks/useItineraries';
import LoadingIndicator from '../components/shared/LoadingIndicator';
import { updatePlan } from '../services/api';
import { TravelPlan } from '../types';

function SavedPlans() {
  const toast = useToast();
  const { plans, loading, error, removePlan, refresh } = useItineraries();
  const [selectedPlan, setSelectedPlan] = useState<TravelPlan | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (error) {
      toast({ title: error, status: 'error', duration: 4000, isClosable: true });
    }
  }, [error, toast]);

  const handleSave = async (updatedPlan: TravelPlan) => {
    setSaving(true);
    try {
      const savedPlan = await updatePlan(updatedPlan);
      setSelectedPlan(savedPlan);
      await refresh();
      toast({ title: 'Saved plan updated.', status: 'success', duration: 3000, isClosable: true });
      return savedPlan;
    } catch {
      toast({ title: 'Unable to save changes.', status: 'error', duration: 4000, isClosable: true });
      return null;
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={8}>
      <Box bg="white" p={6} rounded="lg" shadow="sm">
        <Heading size="lg" mb={3}>
          Saved plans
        </Heading>
        <Text color="gray.600">
          Review existing itineraries and select a plan to edit and save back to the database.
        </Text>
      </Box>

      {loading ? (
        <LoadingIndicator label="Loading saved plans..." />
      ) : (
        <PlansList plans={plans} onSelect={setSelectedPlan} onDelete={removePlan} />
      )}

      {selectedPlan && (
        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <PlanEditor plan={selectedPlan} onSave={handleSave} onCancel={() => setSelectedPlan(null)} isSaving={saving} />
        </Box>
      )}
    </Stack>
  );
}

export default SavedPlans;
