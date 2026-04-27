import { Center, Spinner, Stack, Text } from '@chakra-ui/react';

interface LoadingIndicatorProps {
  label?: string;
}

function LoadingIndicator({ label = 'Loading...' }: LoadingIndicatorProps) {
  return (
    <Center py={10} bg="white" p={6} rounded="lg" shadow="sm">
      <Stack spacing={3} align="center">
        <Spinner size="xl" color="blue.500" />
        <Text color="gray.600">{label}</Text>
      </Stack>
    </Center>
  );
}

export default LoadingIndicator;
