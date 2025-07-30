import React from 'react';
import { Button } from './Button';
import { evaluateScientific, formatNumber } from '../utils/mathUtils';

interface ScientificPanelProps {
  state: any;
  setState: (updater: any) => void;
}

export const ScientificPanel: React.FC<ScientificPanelProps> = ({ state, setState }) => {
  const applyScientificFunction = (func: string) => {
    try {
      const currentValue = parseFloat(state.display);
      const result = evaluateScientific(currentValue, func);
      const formattedResult = formatNumber(result);
      
      setState((prev: any) => ({
        ...prev,
        display: formattedResult,
        waitingForValue: true
      }));
    } catch (error) {
      setState((prev: any) => ({
        ...prev,
        display: 'Error'
      }));
    }
  };

  const scientificButtons = [
    { label: 'sin', func: 'sin' },
    { label: 'cos', func: 'cos' },
    { label: 'tan', func: 'tan' },
    { label: 'ln', func: 'ln' },
    
    { label: 'asin', func: 'asin' },
    { label: 'acos', func: 'acos' },
    { label: 'atan', func: 'atan' },
    { label: 'log', func: 'log' },
    
    { label: '√', func: 'sqrt' },
    { label: 'x²', func: 'square' },
    { label: 'x³', func: 'cube' },
    { label: 'x!', func: 'factorial' },
    
    { label: '1/x', func: 'reciprocal' },
    { label: 'eˣ', func: 'exp' },
    { label: '|x|', func: 'abs' },
    { label: 'π', func: 'pi' }
  ];

  return (
    <div className="scientific-panel mt-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
      <h3 className="text-sm font-medium opacity-70 mb-3">Scientific Functions</h3>
      <div className="grid grid-cols-4 gap-2">
        {scientificButtons.map((button, index) => (
          <Button
            key={index}
            label={button.label}
            onClick={() => {
              if (button.func === 'pi') {
                setState((prev: any) => ({
                  ...prev,
                  display: Math.PI.toString(),
                  waitingForValue: true
                }));
              } else {
                applyScientificFunction(button.func);
              }
            }}
            type="function"
            className="h-10 text-sm"
          />
        ))}
      </div>
    </div>
  );
};