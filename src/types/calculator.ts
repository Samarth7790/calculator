export interface CalculatorState {
  display: string;
  previousValue: string;
  operation: string | null;
  waitingForValue: boolean;
  memory: number;
  history: HistoryEntry[];
  mode: CalculatorMode;
  theme: Theme;
  isScientific: boolean;
  undoStack: CalculatorSnapshot[];
  redoStack: CalculatorSnapshot[];
}

export interface CalculatorSnapshot {
  display: string;
  previousValue: string;
  operation: string | null;
  memory: number;
  timestamp: number;
}

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type CalculatorMode = 'standard' | 'scientific' | 'unit' | 'currency' | 'date' | 'equation' | 'graph';

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  isDark: boolean;
}

export interface UnitConversion {
  category: string;
  fromUnit: string;
  toUnit: string;
  value: number;
  result: number;
}

export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
}

export interface DateCalculation {
  type: 'difference' | 'add' | 'subtract';
  date1: string;
  date2?: string;
  days?: number;
  result: string;
}

export interface EquationSolution {
  equation: string;
  variable: string;
  solution: number | string;
}

export interface GraphPoint {
  x: number;
  y: number;
}

export interface CustomTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  isDark: boolean;
}