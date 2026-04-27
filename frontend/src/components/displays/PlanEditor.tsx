import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
  Textarea,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { TravelPlan } from '../../types';

interface PlanEditorProps {
  plan: TravelPlan;
  onSave: (updatedPlan: TravelPlan) => Promise<TravelPlan | null>;
  onCancel: () => void;
  isSaving?: boolean;
}

function PlanEditor({ plan, onSave, onCancel, isSaving = false }: PlanEditorProps) {
  const [draft, setDraft] = useState<TravelPlan>(plan);

  useEffect(() => {
    setDraft(plan);
  }, [plan]);

  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    setDraft((current) => ({
      ...current,
      itinerary: current.itinerary.map((item, index) =>
        index === dayIndex
          ? { ...item, activities: item.activities.map((activity, activityIdx) => (activityIdx === activityIndex ? value : activity)) }
          : item
      ),
    }));
  };

  const addActivity = (dayIndex: number) => {
    setDraft((current) => ({
      ...current,
      itinerary: current.itinerary.map((item, index) =>
        index === dayIndex ? { ...item, activities: [...item.activities, ''] } : item
      ),
    }));
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    setDraft((current) => ({
      ...current,
      itinerary: current.itinerary.map((item, index) =>
        index === dayIndex
          ? {
              ...item,
              activities: item.activities.filter((_, activityIdx) => activityIdx !== activityIndex),
            }
          : item
      ),
    }));
  };

  const updateNotes = (dayIndex: number, value: string) => {
    setDraft((current) => ({
      ...current,
      itinerary: current.itinerary.map((item, index) =>
        index === dayIndex ? { ...item, notes: value } : item
      ),
    }));
  };

  const addDay = () => {
    setDraft((current) => ({
      ...current,
      itinerary: [
        ...current.itinerary,
        {
          day: current.itinerary.length + 1,
          activities: [''],
          notes: '',
        },
      ],
    }));
  };

  const removeDay = (dayIndex: number) => {
    setDraft((current) => {
      const filtered = current.itinerary.filter((_, index) => index !== dayIndex);
      return {
        ...current,
        itinerary: filtered.map((item, index) => ({ ...item, day: index + 1 })),
      };
    });
  };

  const handleTitleChange = (value: string) => {
    setDraft((current) => ({ ...current, title: value }));
  };

  const handleSave = async () => {
    await onSave(draft);
  };

  return (
    <Box>
      <Stack spacing={6}>
        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <Heading size="lg" mb={4}>
            Edit plan
          </Heading>

          <FormControl mb={4}>
            <FormLabel>Plan title</FormLabel>
            <Input value={draft.title} onChange={(event) => handleTitleChange(event.target.value)} />
          </FormControl>

          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            <FormControl>
              <FormLabel>Destination</FormLabel>
              <Input value={draft.destination} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel>Travelers</FormLabel>
              <Input value={draft.travelers} readOnly />
            </FormControl>
          </Stack>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mt={4}>
            <FormControl>
              <FormLabel>Start date</FormLabel>
              <Input value={draft.startDate} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel>End date</FormLabel>
              <Input value={draft.endDate} readOnly />
            </FormControl>
          </Stack>
        </Box>

        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <Heading size="md" mb={4}>
            Edit itinerary
          </Heading>

          <VStack spacing={6} align="stretch">
            {draft.itinerary.map((item, dayIndex) => (
              <Box key={item.day} p={4} bg="gray.50" rounded="md">
                <HStack justify="space-between" mb={4}>
                  <Heading size="sm">Day {item.day}</Heading>
                  <IconButton
                    aria-label="Remove day"
                    size="sm"
                    icon={<DeleteIcon />}
                    onClick={() => removeDay(dayIndex)}
                    isDisabled={draft.itinerary.length <= 1}
                  />
                </HStack>

                <Stack spacing={3}>
                  {item.activities.map((activity, activityIndex) => (
                    <HStack key={`${dayIndex}-${activityIndex}`} spacing={3} align="flex-start">
                      <Text minW="2rem" pt={2} fontSize="sm">
                        {activityIndex + 1}.
                      </Text>
                      <Input
                        value={activity}
                        onChange={(event) => updateActivity(dayIndex, activityIndex, event.target.value)}
                        placeholder="Activity description"
                      />
                      <IconButton
                        aria-label="Remove activity"
                        icon={<DeleteIcon />}
                        size="sm"
                        onClick={() => removeActivity(dayIndex, activityIndex)}
                        isDisabled={item.activities.length <= 1}
                      />
                    </HStack>
                  ))}

                  <Button leftIcon={<AddIcon />} size="sm" onClick={() => addActivity(dayIndex)}>
                    Add activity
                  </Button>

                  <FormControl>
                    <FormLabel>Notes</FormLabel>
                    <Textarea
                      value={item.notes ?? ''}
                      onChange={(event) => updateNotes(dayIndex, event.target.value)}
                      placeholder="Optional notes for this day"
                    />
                  </FormControl>
                </Stack>
              </Box>
            ))}

            <Button leftIcon={<AddIcon />} variant="outline" onClick={addDay}>
              Add new day
            </Button>
          </VStack>
        </Box>

        <HStack spacing={3}>
          <Button colorScheme="blue" onClick={handleSave} isLoading={isSaving}>
            Save changes
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Close editor
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
}

export default PlanEditor;
