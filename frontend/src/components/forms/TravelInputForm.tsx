import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SimpleGrid,
  Textarea,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const travelFormSchema = z.object({
  destination: z.string().min(2, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  travelers: z
    .number({ invalid_type_error: 'Travelers must be a number' })
    .min(1, 'At least one traveler is required')
    .max(20, 'Please keep the group size 20 or below'),
  interests: z.string().min(5, 'Share at least one interest'),
});

type TravelFormValues = z.infer<typeof travelFormSchema>;

interface TravelInputFormProps {
  isLoading?: boolean;
  defaultValues?: Partial<TravelFormValues>;
  onSubmit: (payload: {
    destination: string;
    startDate: string;
    endDate: string;
    travelers: number;
    interests: string[];
  }) => void | Promise<void>;
}

function TravelInputForm({ isLoading = false, defaultValues, onSubmit }: TravelInputFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TravelFormValues>({
    resolver: zodResolver(travelFormSchema),
    defaultValues: {
      destination: defaultValues?.destination ?? '',
      startDate: defaultValues?.startDate ?? '',
      endDate: defaultValues?.endDate ?? '',
      travelers: defaultValues?.travelers ?? 1,
      interests: defaultValues?.interests ?? '',
    },
  });

  return (
    <Box as="form" onSubmit={handleSubmit((values) => onSubmit({ ...values, interests: values.interests.split(',').map((interest) => interest.trim()).filter(Boolean) }))}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl isInvalid={!!errors.destination}>
          <FormLabel>Destination</FormLabel>
          <Input placeholder="City, country or region" {...register('destination')} />
          <FormErrorMessage>{errors.destination?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.travelers}>
          <FormLabel>Travelers</FormLabel>
          <Input type="number" min={1} max={20} {...register('travelers', { valueAsNumber: true })} />
          <FormErrorMessage>{errors.travelers?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.startDate}>
          <FormLabel>Start date</FormLabel>
          <Input type="date" {...register('startDate')} />
          <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.endDate}>
          <FormLabel>End date</FormLabel>
          <Input type="date" {...register('endDate')} />
          <FormErrorMessage>{errors.endDate?.message}</FormErrorMessage>
        </FormControl>
      </SimpleGrid>

      <FormControl mt={4} isInvalid={!!errors.interests}>
        <FormLabel>Interests</FormLabel>
        <Textarea placeholder="e.g. history, food, beaches" rows={4} {...register('interests')} />
        <FormErrorMessage>{errors.interests?.message}</FormErrorMessage>
      </FormControl>

      <Button mt={6} colorScheme="blue" type="submit" isLoading={isLoading}>
        Generate itinerary
      </Button>
    </Box>
  );
}

export default TravelInputForm;
