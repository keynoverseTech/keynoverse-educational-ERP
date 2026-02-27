import { createContext, useContext } from 'react';
import type { LibraryContextValue } from './libraryTypes';

export const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
