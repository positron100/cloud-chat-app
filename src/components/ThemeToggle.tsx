import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun } from 'lucide-react';

export const ThemeToggle = () => {
  // We'll keep this component but make it non-functional
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full w-10 h-10 transition-all duration-300 hover:bg-accent"
      aria-label="Theme toggle removed"
    >
      <Sun className="h-5 w-5" />
    </Button>
  );
};
