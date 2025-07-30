import { useState, useCallback, useEffect } from 'react';
import { Theme, CustomTheme } from '../types/calculator';
import { saveToStorage, loadFromStorage } from '../utils/storageUtils';

const defaultThemes: Theme[] = [
  {
    name: 'light',
    primary: '#3B82F6',
    secondary: '#14B8A6',
    accent: '#F97316',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#1F2937',
    isDark: false
  },
  {
    name: 'dark',
    primary: '#60A5FA',
    secondary: '#2DD4BF',
    accent: '#FB923C',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9',
    isDark: true
  },
  {
    name: 'ocean',
    primary: '#0EA5E9',
    secondary: '#06B6D4',
    accent: '#8B5CF6',
    background: '#0C4A6E',
    surface: '#075985',
    text: '#E0F2FE',
    isDark: true
  },
  {
    name: 'forest',
    primary: '#10B981',
    secondary: '#059669',
    accent: '#F59E0B',
    background: '#064E3B',
    surface: '#065F46',
    text: '#D1FAE5',
    isDark: true
  }
];

export const useTheme = (initialTheme?: Theme) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    initialTheme || loadFromStorage('currentTheme', defaultThemes[0])
  );
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>(
    loadFromStorage('customThemes', [])
  );

  useEffect(() => {
    saveToStorage('currentTheme', currentTheme);
    document.documentElement.style.setProperty('--primary', currentTheme.primary);
    document.documentElement.style.setProperty('--secondary', currentTheme.secondary);
    document.documentElement.style.setProperty('--accent', currentTheme.accent);
    document.documentElement.style.setProperty('--background', currentTheme.background);
    document.documentElement.style.setProperty('--surface', currentTheme.surface);
    document.documentElement.style.setProperty('--text', currentTheme.text);
  }, [currentTheme]);

  useEffect(() => {
    saveToStorage('customThemes', customThemes);
  }, [customThemes]);

  const switchTheme = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = currentTheme.isDark ? defaultThemes[0] : defaultThemes[1];
    setCurrentTheme(newTheme);
  }, [currentTheme.isDark]);

  const createCustomTheme = useCallback((customTheme: CustomTheme) => {
    setCustomThemes(prev => [...prev, customTheme]);
  }, []);

  const deleteCustomTheme = useCallback((themeId: string) => {
    setCustomThemes(prev => prev.filter(theme => theme.id !== themeId));
  }, []);

  return {
    currentTheme,
    defaultThemes,
    customThemes,
    switchTheme,
    toggleTheme,
    createCustomTheme,
    deleteCustomTheme
  };
};