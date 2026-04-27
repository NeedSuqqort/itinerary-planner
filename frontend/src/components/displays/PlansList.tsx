import { Box, Button, Heading, Stack, Text, VStack } from '@chakra-ui/react';
import { TravelPlan } from '../../types';

interface PlansListProps {
  plans: TravelPlan[];
  onSelect: (plan: TravelPlan) => void;
  onDelete: (planId: string) => void;
}

function PlansList({ plans, onSelect, onDelete }: PlansListProps) {
  if (plans.length === 0) {
    return (
      <Box bg="white" p={6} rounded="lg" shadow="sm">
        <Heading size="md">No saved plans yet</Heading>
        <Text color="gray.600" mt={2}>
          Generate a new itinerary from the Home tab to create your first saved plan.
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {plans.map((plan) => (
        <Box key={plan.id} bg="white" p={5} rounded="lg" shadow="sm">
          <Stack spacing={3}>
            <Box>
              <Heading size="md">{plan.title}</Heading>
              <Text color="gray.600" fontSize="sm">
                {plan.destination} • {plan.travelers} traveler{plan.travelers === 1 ? '' : 's'} • {plan.startDate} to {plan.endDate}
              </Text>
            </Box>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
              <Button colorScheme="blue" size="sm" onClick={() => onSelect(plan)}>
                Edit
              </Button>
              <Button colorScheme="red" variant="outline" size="sm" onClick={() => onDelete(plan.id)}>
                Delete
              </Button>
            </Stack>
          </Stack>
        </Box>
      ))}
    </VStack>
  );
}

export default PlansList;
