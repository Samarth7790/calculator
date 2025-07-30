import React, { useEffect, useRef, useState } from 'react';
import { useCalculator } from '../hooks/useCalculator';
import { useMemory } from '../hooks/useMemory';
import { useTheme } from '../hooks/useTheme';
import { Display } from './Display';
import { ButtonGrid } from './ButtonGrid';
import { ScientificPanel } from './ScientificPanel';
import { MemoryPanel } from './MemoryPanel';
import { HistoryPanel } from './HistoryPanel';
import { ModeSelector } from './ModeSelector';
import { ThemeToggle } from './ThemeToggle';
import { UnitConverter } from './UnitConverter';
import { CurrencyConverter } from './CurrencyConverter';
import { DateCalculator } from './DateCalculator';
import { EquationSolver } from './EquationSolver';
import { GraphPlotter } from './GraphPlotter';
import { KeyboardHelp } from './KeyboardHelp';
import { CustomThemeEditor } from './CustomThemeEditor';
import { Settings, Maximize2, Minimize2, Move, RotateCcw, RotateCw } from 'lucide-react';

export const Calculator: React.FC = () => {
  const calculatorState = useCalculator();
  const memory = useMemory(calculatorState.state.memory);
  const theme = useTheme(calculatorState.state.theme);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Keyboard input handling
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key, ctrlKey, shiftKey } = event;
      
      // Prevent default for calculator keys
      if (/[0-9+\-*/=.%()]/.test(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        event.preventDefault();
      }

      // Handle special key combinations
      if (ctrlKey) {
        switch (key.toLowerCase()) {
          case 'z':
            if (shiftKey) {
              calculatorState.redo();
            } else {
              calculatorState.undo();
            }
            return;
          case 'h':
            setShowKeyboardHelp(true);
            return;
          case 't':
            theme.toggleTheme();
            return;
        }
      }

      // Handle regular calculator keys
      if (/[0-9]/.test(key)) {
        calculatorState.inputNumber(key);
      } else if (key === '.') {
        calculatorState.inputDecimal();
      } else if (['+', '-'].includes(key)) {
        calculatorState.inputOperation(key);
      } else if (['*', '/'].includes(key)) {
        calculatorState.inputOperation(key === '*' ? '×' : '÷');
      } else if (key === '%') {
        calculatorState.inputOperation('%');
      } else if (key === '=' || key === 'Enter') {
        calculatorState.calculate();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        calculatorState.clear();
      } else if (key === 'Backspace') {
        // Handle backspace as deleting last character
        const display = calculatorState.state.display;
        if (display.length > 1) {
          calculatorState.setState(prev => ({
            ...prev,
            display: display.slice(0, -1)
          }));
        } else {
          calculatorState.setState(prev => ({
            ...prev,
            display: '0'
          }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [calculatorState, theme]);

  // Drag functionality
  const handleMouseDown = (event: React.MouseEvent) => {
    if (isMaximized) return;
    
    setIsDragging(true);
    dragStartRef.current = {
      x: event.clientX - (calculatorRef.current?.offsetLeft || 0),
      y: event.clientY - (calculatorRef.current?.offsetTop || 0)
    };
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging || !calculatorRef.current || isMaximized) return;
    
    const newX = event.clientX - dragStartRef.current.x;
    const newY = event.clientY - dragStartRef.current.y;
    
    calculatorRef.current.style.left = `${Math.max(0, Math.min(newX, window.innerWidth - calculatorRef.current.offsetWidth))}px`;
    calculatorRef.current.style.top = `${Math.max(0, Math.min(newY, window.innerHeight - calculatorRef.current.offsetHeight))}px`;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (calculatorRef.current) {
      if (!isMaximized) {
        calculatorRef.current.style.position = 'fixed';
        calculatorRef.current.style.top = '0';
        calculatorRef.current.style.left = '0';
        calculatorRef.current.style.width = '100vw';
        calculatorRef.current.style.height = '100vh';
        calculatorRef.current.style.zIndex = '1000';
      } else {
        calculatorRef.current.style.position = 'relative';
        calculatorRef.current.style.width = 'auto';
        calculatorRef.current.style.height = 'auto';
        calculatorRef.current.style.zIndex = 'auto';
      }
    }
  };

  const renderModeContent = () => {
    switch (calculatorState.state.mode) {
      case 'unit':
        return <UnitConverter />;
      case 'currency':
        return <CurrencyConverter />;
      case 'date':
        return <DateCalculator />;
      case 'equation':
        return <EquationSolver />;
      case 'graph':
        return <GraphPlotter />;
      default:
        return (
          <div className="space-y-4">
            <Display 
              value={calculatorState.state.display}
              expression={calculatorState.state.previousValue && calculatorState.state.operation 
                ? `${calculatorState.state.previousValue} ${calculatorState.state.operation}` 
                : ''}
            />
            <div className="flex gap-4">
              <div className="flex-1">
                <ButtonGrid {...calculatorState} />
                {calculatorState.state.isScientific && <ScientificPanel {...calculatorState} />}
              </div>
              <div className="w-64 space-y-4">
                <MemoryPanel memory={memory} currentValue={parseFloat(calculatorState.state.display)} />
                <HistoryPanel 
                  history={calculatorState.state.history} 
                  onClearHistory={calculatorState.clearHistory}
                  onSelectEntry={(entry) => {
                    calculatorState.setState(prev => ({
                      ...prev,
                      display: entry.result,
                      waitingForValue: true
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen transition-all duration-500" style={{
      background: theme.currentTheme.isDark 
        ? 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 50%, #020617 100%)' 
        : 'radial-gradient(ellipse at top, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)'
    }}>
      <div 
        ref={calculatorRef}
        className={`calculator-container ${isMaximized ? 'maximized' : 'windowed'} ${isDragging ? 'dragging' : ''}`}
        style={{
          position: isMaximized ? 'fixed' : 'relative',
          top: isMaximized ? 0 : 'auto',
          left: isMaximized ? 0 : 'auto',
          width: isMaximized ? '100vw' : 'auto',
          height: isMaximized ? '100vh' : 'auto',
          zIndex: isMaximized ? 1000 : 'auto'
        }}
      >
        {/* Window Controls */}
        <div 
          className="window-controls flex items-center justify-between p-3 bg-white/10 backdrop-blur-md border-b border-white/20 cursor-move"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center space-x-2">
            <Move className="w-4 h-4 opacity-60" />
            <span className="text-sm font-medium opacity-80">Advanced Calculator</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={calculatorState.undo}
              disabled={calculatorState.state.undoStack.length === 0}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={calculatorState.redo}
              disabled={calculatorState.state.redoStack.length === 0}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30"
              title="Redo (Ctrl+Shift+Z)"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 rounded hover:bg-white/10"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={toggleMaximize}
              className="p-1 rounded hover:bg-white/10"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute top-12 right-0 w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-xl border border-white/20 p-4 z-50">
            <div className="space-y-3">
              <ThemeToggle currentTheme={theme.currentTheme} onToggle={theme.toggleTheme} />
              <button
                onClick={() => {
                  setShowThemeEditor(true);
                  setShowSettings(false);
                }}
                className="w-full text-left px-3 py-2 rounded hover:bg-white/10 text-sm"
              >
                Custom Themes
              </button>
              <button
                onClick={() => {
                  setShowKeyboardHelp(true);
                  setShowSettings(false);
                }}
                className="w-full text-left px-3 py-2 rounded hover:bg-white/10 text-sm"
              >
                Keyboard Shortcuts
              </button>
            </div>
          </div>
        )}

        {/* Main Calculator Content */}
        <div className="calculator-content p-6 space-y-6">
          <ModeSelector 
            currentMode={calculatorState.state.mode}
            onModeChange={calculatorState.setMode}
            isScientific={calculatorState.state.isScientific}
            onToggleScientific={calculatorState.toggleScientific}
          />
          
          {renderModeContent()}
        </div>

        {/* Theme Editor Modal */}
        {showThemeEditor && (
          <CustomThemeEditor
            currentTheme={theme.currentTheme}
            customThemes={theme.customThemes}
            onCreateTheme={theme.createCustomTheme}
            onDeleteTheme={theme.deleteCustomTheme}
            onApplyTheme={theme.switchTheme}
            onClose={() => setShowThemeEditor(false)}
          />
        )}

        {/* Keyboard Help Modal */}
        {showKeyboardHelp && (
          <KeyboardHelp onClose={() => setShowKeyboardHelp(false)} />
        )}
      </div>
    </div>
  );
};