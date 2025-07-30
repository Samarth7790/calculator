import { useState, useCallback, useEffect } from 'react';
import { CalculatorState, CalculatorMode, CalculatorSnapshot, HistoryEntry } from '../types/calculator';
import { evaluateExpression, formatNumber } from '../utils/mathUtils';
import { playSound } from '../utils/audioUtils';
import { saveToStorage, loadFromStorage } from '../utils/storageUtils';

const initialState: CalculatorState = {
  display: '0',
  previousValue: '',
  operation: null,
  waitingForValue: false,
  memory: 0,
  history: [],
  mode: 'standard',
  theme: {
    name: 'light',
    primary: '#3B82F6',
    secondary: '#14B8A6',
    accent: '#F97316',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#1F2937',
    isDark: false
  },
  isScientific: false,
  undoStack: [],
  redoStack: []
};

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>(() => {
    const saved = loadFromStorage('calculatorState');
    return saved ? { ...initialState, ...saved } : initialState;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveToStorage('calculatorState', {
      memory: state.memory,
      history: state.history,
      theme: state.theme,
      mode: state.mode,
      isScientific: state.isScientific
    });
  }, [state.memory, state.history, state.theme, state.mode, state.isScientific]);

  const createSnapshot = useCallback((): CalculatorSnapshot => ({
    display: state.display,
    previousValue: state.previousValue,
    operation: state.operation,
    memory: state.memory,
    timestamp: Date.now()
  }), [state]);

  const addToHistory = useCallback((expression: string, result: string) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      expression,
      result,
      timestamp: Date.now()
    };
    
    setState(prev => ({
      ...prev,
      history: [entry, ...prev.history.slice(0, 99)] // Keep last 100 entries
    }));
  }, []);

  const inputNumber = useCallback((number: string) => {
    playSound('click');
    
    setState(prev => {
      const snapshot = createSnapshot();
      
      if (prev.waitingForValue) {
        return {
          ...prev,
          display: number,
          waitingForValue: false,
          undoStack: [...prev.undoStack, snapshot],
          redoStack: []
        };
      }
      
      const newDisplay = prev.display === '0' ? number : prev.display + number;
      
      return {
        ...prev,
        display: newDisplay,
        undoStack: [...prev.undoStack, snapshot],
        redoStack: []
      };
    });
  }, [createSnapshot]);

  const inputDecimal = useCallback(() => {
    playSound('click');
    
    setState(prev => {
      if (prev.display.includes('.')) return prev;
      
      const snapshot = createSnapshot();
      
      return {
        ...prev,
        display: prev.waitingForValue ? '0.' : prev.display + '.',
        waitingForValue: false,
        undoStack: [...prev.undoStack, snapshot],
        redoStack: []
      };
    });
  }, [createSnapshot]);

  const inputOperation = useCallback((nextOperation: string) => {
    playSound('click');
    
    setState(prev => {
      const snapshot = createSnapshot();
      const inputValue = parseFloat(prev.display);
      
      if (prev.previousValue === '' || prev.waitingForValue) {
        return {
          ...prev,
          previousValue: prev.display,
          operation: nextOperation,
          waitingForValue: true,
          undoStack: [...prev.undoStack, snapshot],
          redoStack: []
        };
      }
      
      const currentValue = parseFloat(prev.previousValue);
      const result = evaluateExpression(currentValue, inputValue, prev.operation!);
      const formattedResult = formatNumber(result);
      
      return {
        ...prev,
        display: formattedResult,
        previousValue: formattedResult,
        operation: nextOperation,
        waitingForValue: true,
        undoStack: [...prev.undoStack, snapshot],
        redoStack: []
      };
    });
  }, [createSnapshot]);

  const calculate = useCallback(() => {
    playSound('equals');
    
    setState(prev => {
      if (prev.operation === null || prev.waitingForValue) return prev;
      
      const snapshot = createSnapshot();
      const currentValue = parseFloat(prev.previousValue);
      const inputValue = parseFloat(prev.display);
      const result = evaluateExpression(currentValue, inputValue, prev.operation);
      const formattedResult = formatNumber(result);
      
      const expression = `${prev.previousValue} ${prev.operation} ${prev.display}`;
      addToHistory(expression, formattedResult);
      
      return {
        ...prev,
        display: formattedResult,
        previousValue: '',
        operation: null,
        waitingForValue: true,
        undoStack: [...prev.undoStack, snapshot],
        redoStack: []
      };
    });
  }, [createSnapshot, addToHistory]);

  const clear = useCallback(() => {
    playSound('clear');
    
    setState(prev => ({
      ...prev,
      display: '0',
      previousValue: '',
      operation: null,
      waitingForValue: false
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState(prev => ({ ...prev, history: [] }));
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.undoStack.length === 0) return prev;
      
      const lastSnapshot = prev.undoStack[prev.undoStack.length - 1];
      const currentSnapshot = createSnapshot();
      
      return {
        ...prev,
        display: lastSnapshot.display,
        previousValue: lastSnapshot.previousValue,
        operation: lastSnapshot.operation,
        memory: lastSnapshot.memory,
        undoStack: prev.undoStack.slice(0, -1),
        redoStack: [...prev.redoStack, currentSnapshot]
      };
    });
  }, [createSnapshot]);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.redoStack.length === 0) return prev;
      
      const nextSnapshot = prev.redoStack[prev.redoStack.length - 1];
      const currentSnapshot = createSnapshot();
      
      return {
        ...prev,
        display: nextSnapshot.display,
        previousValue: nextSnapshot.previousValue,
        operation: nextSnapshot.operation,
        memory: nextSnapshot.memory,
        undoStack: [...prev.undoStack, currentSnapshot],
        redoStack: prev.redoStack.slice(0, -1)
      };
    });
  }, [createSnapshot]);

  const setMode = useCallback((mode: CalculatorMode) => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const toggleScientific = useCallback(() => {
    setState(prev => ({ ...prev, isScientific: !prev.isScientific }));
  }, []);

  return {
    state,
    setState,
    inputNumber,
    inputDecimal,
    inputOperation,
    calculate,
    clear,
    clearHistory,
    undo,
    redo,
    setMode,
    toggleScientific,
    addToHistory
  };
};