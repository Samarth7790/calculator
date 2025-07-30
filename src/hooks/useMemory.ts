import { useState, useCallback } from 'react';
import { playSound } from '../utils/audioUtils';

export const useMemory = (initialValue: number = 0) => {
  const [memory, setMemory] = useState(initialValue);

  const memoryAdd = useCallback((value: number) => {
    playSound('memory');
    setMemory(prev => prev + value);
  }, []);

  const memorySubtract = useCallback((value: number) => {
    playSound('memory');
    setMemory(prev => prev - value);
  }, []);

  const memoryRecall = useCallback(() => {
    playSound('memory');
    return memory;
  }, [memory]);

  const memoryClear = useCallback(() => {
    playSound('memory');
    setMemory(0);
  }, []);

  const memoryStore = useCallback((value: number) => {
    playSound('memory');
    setMemory(value);
  }, []);

  return {
    memory,
    memoryAdd,
    memorySubtract,
    memoryRecall,
    memoryClear,
    memoryStore
  };
};