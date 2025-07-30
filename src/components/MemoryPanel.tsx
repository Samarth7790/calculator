import React from 'react';
import { Button } from './Button';

interface MemoryPanelProps {
  memory: {
    memory: number;
    memoryAdd: (value: number) => void;
    memorySubtract: (value: number) => void;
    memoryRecall: () => number;
    memoryClear: () => void;
    memoryStore: (value: number) => void;
  };
  currentValue: number;
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({ memory, currentValue }) => {
  const handleMemoryRecall = () => {
    // This would typically set the display to the memory value
    // Implementation depends on calculator state management
  };

  return (
    <div className="memory-panel bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
      <h3 className="text-sm font-medium opacity-70 mb-3">Memory</h3>
      
      {/* Memory Display */}
      <div className="mb-3 p-2 bg-white/5 rounded-lg text-sm font-mono text-center">
        M: {memory.memory.toFixed(4)}
      </div>
      
      {/* Memory Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          label="MC"
          onClick={memory.memoryClear}
          type="function"
          className="h-8 text-xs"
        />
        <Button
          label="MR"
          onClick={handleMemoryRecall}
          type="function"
          className="h-8 text-xs"
        />
        <Button
          label="M+"
          onClick={() => memory.memoryAdd(currentValue)}
          type="function"
          className="h-8 text-xs"
        />
        <Button
          label="M-"
          onClick={() => memory.memorySubtract(currentValue)}
          type="function"
          className="h-8 text-xs"
        />
        <Button
          label="MS"
          onClick={() => memory.memoryStore(currentValue)}
          type="function"
          className="h-8 text-xs col-span-2"
        />
      </div>
    </div>
  );
};