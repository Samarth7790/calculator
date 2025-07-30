import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  type?: 'number' | 'operator' | 'function' | 'clear' | 'equals';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  type = 'number', 
  className = '', 
  disabled = false 
}) => {
  const getButtonStyles = () => {
    const baseStyles = 'button-base relative h-14 rounded-xl font-medium text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 backdrop-blur-sm border';
    
    switch (type) {
      case 'number':
        return `${baseStyles} bg-white/20 hover:bg-white/30 border-white/30 text-white shadow-lg`;
      case 'operator':
        return `${baseStyles} bg-blue-500/80 hover:bg-blue-400/80 border-blue-400/50 text-white shadow-lg`;
      case 'function':
        return `${baseStyles} bg-gray-500/60 hover:bg-gray-400/60 border-gray-400/50 text-white shadow-lg`;
      case 'clear':
        return `${baseStyles} bg-red-500/80 hover:bg-red-400/80 border-red-400/50 text-white shadow-lg`;
      case 'equals':
        return `${baseStyles} bg-green-500/80 hover:bg-green-400/80 border-green-400/50 text-white shadow-lg font-bold`;
      default:
        return baseStyles;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${getButtonStyles()} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {/* Button Glow Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/10 pointer-events-none"></div>
      
      {/* Button Content */}
      <span className="relative z-10">{label}</span>
    </button>
  );
};