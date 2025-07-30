import React, { useState, useRef, useEffect } from 'react';
import { GraphPoint } from '../types/calculator';

export const GraphPlotter: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [equation, setEquation] = useState('x^2');
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const [points, setPoints] = useState<GraphPoint[]>([]);

  const evaluateFunction = (x: number, equation: string): number => {
    try {
      // Replace common mathematical notation
      let expr = equation
        .replace(/\^/g, '**')
        .replace(/x/g, `(${x})`)
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/pi/g, 'Math.PI')
        .replace(/e(?![a-z])/g, 'Math.E');

      // Use Function constructor for safe evaluation
      return Function(`"use strict"; return (${expr})`)();
    } catch (error) {
      return NaN;
    }
  };

  const generatePoints = () => {
    const newPoints: GraphPoint[] = [];
    const step = (xMax - xMin) / 1000;
    
    for (let x = xMin; x <= xMax; x += step) {
      const y = evaluateFunction(x, equation);
      if (!isNaN(y) && isFinite(y)) {
        newPoints.push({ x, y });
      }
    }
    
    setPoints(newPoints);
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up transformation
    const scaleX = width / (xMax - xMin);
    const scaleY = height / (yMax - yMin);
    
    const transformX = (x: number) => (x - xMin) * scaleX;
    const transformY = (y: number) => height - (y - yMin) * scaleY;
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      const screenX = transformX(x);
      ctx.beginPath();
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = Math.ceil(yMin); y <= yMax; y++) {
      const screenY = transformY(y);
      ctx.beginPath();
      ctx.moveTo(0, screenY);
      ctx.lineTo(width, screenY);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    
    // X-axis
    if (yMin <= 0 && yMax >= 0) {
      const y0 = transformY(0);
      ctx.beginPath();
      ctx.moveTo(0, y0);
      ctx.lineTo(width, y0);
      ctx.stroke();
    }
    
    // Y-axis
    if (xMin <= 0 && xMax >= 0) {
      const x0 = transformX(0);
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.lineTo(x0, height);
      ctx.stroke();
    }
    
    // Draw function
    if (points.length > 0) {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      let started = false;
      for (const point of points) {
        const screenX = transformX(point.x);
        const screenY = transformY(point.y);
        
        if (screenY >= 0 && screenY <= height) {
          if (!started) {
            ctx.moveTo(screenX, screenY);
            started = true;
          } else {
            ctx.lineTo(screenX, screenY);
          }
        } else {
          started = false;
        }
      }
      
      ctx.stroke();
    }
    
    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    
    // X-axis labels
    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      if (x !== 0) {
        const screenX = transformX(x);
        const screenY = yMin <= 0 && yMax >= 0 ? transformY(0) + 15 : height - 5;
        ctx.fillText(x.toString(), screenX, screenY);
      }
    }
    
    ctx.textAlign = 'left';
    // Y-axis labels
    for (let y = Math.ceil(yMin); y <= yMax; y++) {
      if (y !== 0) {
        const screenX = xMin <= 0 && xMax >= 0 ? transformX(0) + 5 : 5;
        const screenY = transformY(y) - 5;
        ctx.fillText(y.toString(), screenX, screenY);
      }
    }
  };

  useEffect(() => {
    generatePoints();
  }, [equation, xMin, xMax, yMin, yMax]);

  useEffect(() => {
    drawGraph();
  }, [points, xMin, xMax, yMin, yMax]);

  const exampleFunctions = [
    'x^2',
    'x^3',
    'sin(x)',
    'cos(x)',
    '1/x',
    'sqrt(x)',
    'abs(x)',
    'x^2 - 4*x + 3'
  ];

  return (
    <div className="graph-plotter bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Function Grapher</h2>
      
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Function (y =)</label>
          <input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder="Enter function (e.g., x^2, sin(x))"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-2">X Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={xMin}
                onChange={(e) => setXMin(parseFloat(e.target.value))}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Min"
              />
              <input
                type="number"
                value={xMax}
                onChange={(e) => setXMax(parseFloat(e.target.value))}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Max"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Y Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={yMin}
                onChange={(e) => setYMin(parseFloat(e.target.value))}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Min"
              />
              <input
                type="number"
                value={yMax}
                onChange={(e) => setYMax(parseFloat(e.target.value))}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Graph Canvas */}
      <div className="mb-6 p-4 bg-white/5 rounded-lg">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-auto border border-white/20 rounded-lg bg-gray-900/50"
        />
      </div>
      
      {/* Example Functions */}
      <div>
        <div className="text-sm opacity-60 mb-3">Example Functions</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {exampleFunctions.map((func, index) => (
            <button
              key={index}
              onClick={() => setEquation(func)}
              className="text-left p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 font-mono text-sm"
            >
              y = {func}
            </button>
          ))}
        </div>
      </div>
      
      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="text-sm">
          <div className="font-medium mb-2">Supported Functions:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs opacity-80">
            <div>• Basic: +, -, *, /, ^</div>
            <div>• Trigonometry: sin, cos, tan</div>
            <div>• Logarithms: log, ln</div>
            <div>• Other: sqrt, abs, pi, e</div>
          </div>
        </div>
      </div>
    </div>
  );
};