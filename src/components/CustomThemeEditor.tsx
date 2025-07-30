import React, { useState } from 'react';
import { Theme, CustomTheme } from '../types/calculator';
import { X, Save, Trash2, Palette } from 'lucide-react';

interface CustomThemeEditorProps {
  currentTheme: Theme;
  customThemes: CustomTheme[];
  onCreateTheme: (theme: CustomTheme) => void;
  onDeleteTheme: (themeId: string) => void;
  onApplyTheme: (theme: Theme) => void;
  onClose: () => void;
}

export const CustomThemeEditor: React.FC<CustomThemeEditorProps> = ({
  currentTheme,
  customThemes,
  onCreateTheme,
  onDeleteTheme,
  onApplyTheme,
  onClose
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [colors, setColors] = useState({
    primary: '#3B82F6',
    secondary: '#14B8A6',
    accent: '#F97316',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#1F2937'
  });
  const [isDark, setIsDark] = useState(false);

  const handleCreateTheme = () => {
    if (!themeName.trim()) return;
    
    const newTheme: CustomTheme = {
      id: Date.now().toString(),
      name: themeName,
      colors,
      isDark
    };
    
    onCreateTheme(newTheme);
    setIsCreating(false);
    setThemeName('');
  };

  const handleApplyCustomTheme = (customTheme: CustomTheme) => {
    const theme: Theme = {
      name: customTheme.name,
      primary: customTheme.colors.primary,
      secondary: customTheme.colors.secondary,
      accent: customTheme.colors.accent,
      background: customTheme.colors.background,
      surface: customTheme.colors.surface,
      text: customTheme.colors.text,
      isDark: customTheme.isDark
    };
    
    onApplyTheme(theme);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-white/20 p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Custom Themes
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Existing Custom Themes */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3 opacity-70">Your Custom Themes</h4>
          {customThemes.length === 0 ? (
            <p className="text-sm opacity-60 text-center py-4">
              No custom themes yet. Create your first one below!
            </p>
          ) : (
            <div className="space-y-2">
              {customThemes.map((theme) => (
                <div
                  key={theme.id}
                  className="flex items-center justify-between p-3 bg-white/10 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white/20"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <span className="font-medium">{theme.name}</span>
                    <span className="text-xs opacity-60">
                      {theme.isDark ? 'Dark' : 'Light'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApplyCustomTheme(theme)}
                      className="px-3 py-1 bg-blue-500/80 hover:bg-blue-400/80 rounded text-sm transition-colors"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => onDeleteTheme(theme.id)}
                      className="p-1 bg-red-500/80 hover:bg-red-400/80 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Create New Theme */}
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full p-3 bg-green-500/80 hover:bg-green-400/80 rounded-lg transition-colors flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Create New Theme
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme Name</label>
              <input
                type="text"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="My Custom Theme"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(colors).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-2 capitalize">
                    {key} Color
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => setColors(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-12 h-10 rounded border border-white/20 bg-transparent"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setColors(prev => ({ ...prev, [key]: e.target.value }))}
                      className="flex-1 p-2 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDark"
                checked={isDark}
                onChange={(e) => setIsDark(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="isDark" className="text-sm">
                Dark theme
              </label>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleCreateTheme}
                disabled={!themeName.trim()}
                className="flex-1 p-3 bg-green-500/80 hover:bg-green-400/80 disabled:opacity-50 rounded-lg transition-colors"
              >
                Save Theme
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-3 bg-gray-500/80 hover:bg-gray-400/80 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};