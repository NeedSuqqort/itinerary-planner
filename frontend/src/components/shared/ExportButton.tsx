import { Button } from '@chakra-ui/react';
import { TravelPlan } from '../../types';

interface ExportButtonProps {
  plan: TravelPlan;
}

function ExportButton({ plan }: ExportButtonProps) {
  const handleExport = () => {
    const fileName = `${plan.destination.replace(/\s+/g, '_')}-${plan.id}.json`;
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button colorScheme="teal" onClick={handleExport} size="sm">
      Export JSON
    </Button>
  );
}

export default ExportButton;
