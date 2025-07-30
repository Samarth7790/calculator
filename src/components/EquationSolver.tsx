import React, { useState } from 'react';
import { solveLinearEquation } from '../utils/mathUtils';

export const EquationSolver: React.FC = () => {
  const [equation, setEquation] = useState('2x + 5 = 13');
  const [variable, setVariable] = useState('x');
  const [solution, setSolution] = useState('');
  const [steps, setSteps] = useState<string[]>([]);

  const handleSolve = () => {
    try {
      const result = solveLinearEquation(equation, variable);
      setSolution(result.toString());
      
      // Generate solution steps (simplified)
      const parts = equation.split('=');
      const left = parts[0].trim();
      const right = parts[1].trim();
      
      setSteps([
        `Original equation: ${equation}`,
        `Isolate ${variable}: ${left} = ${right}`,
        `Solution: ${variable} = ${result}`
      ]);
    } catch (error) {
      setSolution('Error: ' + (error as Error).message);
      setSteps([]);
    }
  };

  React.useEffect(() => {
    handleSolve();
  }, [equation, variable]);

  const exampleEquations = [
    '2x + 5 = 13',
    '3x - 7 = 14',
    '5x + 10 = 25',
    'x/2 + 3 = 8',
    '4x - 12 = 0'
  ];

  return (
    <div className="equation-solver bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Equation Solver</h2>
      
      {/* Input Section */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Linear Equation</label>
          <input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder="Enter equation (e.g., 2x + 5 = 13)"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Variable to solve for</label>
          <input
            type="text"
            value={variable}
            onChange={(e) => setVariable(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder="Variable (e.g., x)"
          />
        </div>
      </div>

      {/* Solution Display */}
      <div className="mb-6 p-4 bg-white/5 rounded-lg">
        <div className="text-sm opacity-60 mb-2">Solution</div>
        <div className="text-2xl font-mono font-bold text-center">
          {variable} = {solution || 'Enter equation'}
        </div>
      </div>

      {/* Solution Steps */}
      {steps.length > 0 && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg">
          <div className="text-sm opacity-60 mb-3">Solution Steps</div>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="text-sm font-mono bg-white/5 p-2 rounded">
                {index + 1}. {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Example Equations */}
      <div>
        <div className="text-sm opacity-60 mb-3">Example Equations</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {exampleEquations.map((example, index) => (
            <button
              key={index}
              onClick={() => setEquation(example)}
              className="text-left p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 font-mono text-sm"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="text-sm">
          <div className="font-medium mb-2">Supported Format:</div>
          <ul className="space-y-1 text-xs opacity-80">
            <li>• Linear equations: ax + b = c</li>
            <li>• Use standard mathematical notation</li>
            <li>• Examples: 2x + 5 = 13, 3y - 7 = 14</li>
            <li>• Variable can be any letter (x, y, z, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};