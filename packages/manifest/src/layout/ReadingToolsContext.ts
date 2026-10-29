import { createContext } from 'react';

export const ReadingToolsContext = createContext<{
  isOpen: boolean;
  id: string;
  onClose: () => void;
} | null>(null);
