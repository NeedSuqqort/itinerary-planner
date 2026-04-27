import { Box, Button, Heading, Stack, Text, UnorderedList, ListItem, VStack } from '@chakra-ui/react';
import ExportButton from '../shared/ExportButton';
import { TravelPlan } from '../../types';

interface ItineraryDisplayProps {
  plan: TravelPlan;
}

function ItineraryDisplay({ plan }: ItineraryDisplayProps) {
  return (
    <Stack spacing={6}>
      <Box>
        <Heading size="lg">{plan.title}</Heading>
        <Text color="gray.600" mt={2}>
          {plan.destination} • {plan.travelers} traveler{plan.travelers === 1 ? '' : 's'} • {plan.startDate} to {plan.endDate}
        </Text>
      </Box>

      <Box>
        <Heading size="md" mb={3}>
          Suggested itinerary
        </Heading>
        <Stack spacing={4}>
          {plan.itinerary.map((item) => (
            <Box key={item.day} p={4} bg="gray.50" rounded="md">
              <Heading size="sm">Day {item.day}</Heading>
              <UnorderedList mt={2} spacing={2}>
                {item.activities.map((activity, index) => (
                  <ListItem key={index}>{activity}</ListItem>
                ))}
              </UnorderedList>
              {item.notes && <Text mt={2}>{item.notes}</Text>}
            </Box>
          ))}
        </Stack>
      </Box>

      <VStack align="flex-start" spacing={3}>
        <ExportButton plan={plan} />
        <Button variant="outline" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to top
        </Button>
      </VStack>
    </Stack>
  );
}

export default ItineraryDisplay;
