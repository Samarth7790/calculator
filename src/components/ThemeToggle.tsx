import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Theme } from '../types/calculator';

interface ThemeToggleProps {
  currentTheme: Theme;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-sm"
      title={`Switch to ${currentTheme.isDark ? 'light' : 'dark'} theme`}
    >
      {currentTheme.isDark ? (
        <>
          <Sun className="w-4 h-4" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
};