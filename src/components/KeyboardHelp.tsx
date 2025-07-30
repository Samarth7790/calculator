import React from 'react';
import { X } from 'lucide-react';

interface KeyboardHelpProps {
  onClose: () => void;
}

export const KeyboardHelp: React.FC<KeyboardHelpProps> = ({ onClose }) => {
  const shortcuts = [
    { key: '0-9', description: 'Input numbers' },
    { key: '+', description: 'Addition' },
    { key: '-', description: 'Subtraction' },
    { key: '*', description: 'Multiplication' },
    { key: '/', description: 'Division' },
    { key: '%', description: 'Modulo' },
    { key: '.', description: 'Decimal point' },
    { key: '=', description: 'Calculate result' },
    { key: 'Enter', description: 'Calculate result' },
    { key: 'Escape', description: 'Clear calculator' },
    { key: 'C', description: 'Clear calculator' },
    { key: 'Backspace', description: 'Delete last character' },
    { key: 'Ctrl+Z', description: 'Undo last action' },
    { key: 'Ctrl+Shift+Z', description: 'Redo last action' },
    { key: 'Ctrl+H', description: 'Show this help' },
    { key: 'Ctrl+T', description: 'Toggle theme' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-white/20 p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Keyboard Shortcuts</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <kbd className="px-2 py-1 bg-white/20 border border-white/30 rounded text-sm font-mono">
                {shortcut.key}
              </kbd>
              <span className="text-sm opacity-80">{shortcut.description}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs opacity-80">
            Tip: You can use your keyboard for all calculator operations. 
            Press Ctrl+H anytime to show this help dialog.
          </p>
        </div>
      </div>
    </div>
  );
};