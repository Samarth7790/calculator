import React from 'react';
import { CalculatorMode } from '../types/calculator';
import { Calculator, Beaker, DollarSign, Calendar, FunctionSquare as Function, BarChart, Settings } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
  isScientific: boolean;
  onToggleScientific: () => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onModeChange,
  isScientific,
  onToggleScientific
}) => {
  const modes = [
    { key: 'standard' as const, label: 'Standard', icon: Calculator },
    { key: 'unit' as const, label: 'Units', icon: Beaker },
    { key: 'currency' as const, label: 'Currency', icon: DollarSign },
    { key: 'date' as const, label: 'Date', icon: Calendar },
    { key: 'equation' as const, label: 'Equation', icon: Function },
    { key: 'graph' as const, label: 'Graph', icon: BarChart }
  ];

  return (
    <div className="mode-selector flex flex-wrap gap-2 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
      {/* Mode Buttons */}
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <button
            key={mode.key}
            onClick={() => onModeChange(mode.key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              currentMode === mode.key
                ? 'bg-blue-500/80 text-white shadow-lg'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{mode.label}</span>
          </button>
        );
      })}
      
      {/* Scientific Toggle (only for standard mode) */}
      {currentMode === 'standard' && (
        <button
          onClick={onToggleScientific}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ml-4 ${
            isScientific
              ? 'bg-purple-500/80 text-white shadow-lg'
              : 'bg-white/10 hover:bg-white/20 text-white/80'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Scientific</span>
        </button>
      )}
    </div>
  );
};