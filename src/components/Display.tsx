import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../utils/exportUtils';

interface DisplayProps {
  value: string;
  expression?: string;
}

export const Display: React.FC<DisplayProps> = ({ value, expression }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="display bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-right relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid-pattern w-full h-full"></div>
      </div>
      
      {/* Expression */}
      {expression && (
        <div className="text-sm opacity-60 mb-2 font-mono">
          {expression}
        </div>
      )}
      
      {/* Main Display */}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-right">
          <span className="text-3xl font-light font-mono tracking-wider break-all">
            {value}
          </span>
        </div>
        
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="ml-4 p-2 rounded-full hover:bg-white/10 transition-all duration-200 opacity-60 hover:opacity-100"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-400" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {/* Copy Feedback */}
      {copied && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded animate-fade-in">
          Copied!
        </div>
      )}
    </div>
  );
};