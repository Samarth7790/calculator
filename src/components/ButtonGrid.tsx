import React from 'react';
import { Button } from './Button';

interface ButtonGridProps {
  inputNumber: (num: string) => void;
  inputDecimal: () => void;
  inputOperation: (op: string) => void;
  calculate: () => void;
  clear: () => void;
}

export const ButtonGrid: React.FC<ButtonGridProps> = ({
  inputNumber,
  inputDecimal,
  inputOperation,
  calculate,
  clear
}) => {
  const buttons = [
    { label: 'C', onClick: clear, type: 'clear' as const, className: 'col-span-2' },
    { label: '±', onClick: () => {}, type: 'function' as const },
    { label: '÷', onClick: () => inputOperation('÷'), type: 'operator' as const },
    
    { label: '7', onClick: () => inputNumber('7'), type: 'number' as const },
    { label: '8', onClick: () => inputNumber('8'), type: 'number' as const },
    { label: '9', onClick: () => inputNumber('9'), type: 'number' as const },
    { label: '×', onClick: () => inputOperation('×'), type: 'operator' as const },
    
    { label: '4', onClick: () => inputNumber('4'), type: 'number' as const },
    { label: '5', onClick: () => inputNumber('5'), type: 'number' as const },
    { label: '6', onClick: () => inputNumber('6'), type: 'number' as const },
    { label: '-', onClick: () => inputOperation('-'), type: 'operator' as const },
    
    { label: '1', onClick: () => inputNumber('1'), type: 'number' as const },
    { label: '2', onClick: () => inputNumber('2'), type: 'number' as const },
    { label: '3', onClick: () => inputNumber('3'), type: 'number' as const },
    { label: '+', onClick: () => inputOperation('+'), type: 'operator' as const, className: 'row-span-2' },
    
    { label: '0', onClick: () => inputNumber('0'), type: 'number' as const, className: 'col-span-2' },
    { label: '.', onClick: inputDecimal, type: 'function' as const },
    
    { label: '=', onClick: calculate, type: 'equals' as const, className: 'col-span-4' }
  ];

  return (
    <div className="button-grid grid grid-cols-4 gap-3 max-w-md">
      {buttons.map((button, index) => (
        <Button
          key={index}
          label={button.label}
          onClick={button.onClick}
          type={button.type}
          className={button.className}
        />
      ))}
    </div>
  );
};