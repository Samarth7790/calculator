import React, { useState } from 'react';
import { unitCategories, convertUnit } from '../utils/unitUtils';
import { ArrowLeftRight } from 'lucide-react';

export const UnitConverter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(unitCategories[0]);
  const [fromUnit, setFromUnit] = useState(selectedCategory.units[0]);
  const [toUnit, setToUnit] = useState(selectedCategory.units[1]);
  const [inputValue, setInputValue] = useState('1');
  const [result, setResult] = useState('');

  const handleCategoryChange = (categoryName: string) => {
    const category = unitCategories.find(cat => cat.name === categoryName);
    if (category) {
      setSelectedCategory(category);
      setFromUnit(category.units[0]);
      setToUnit(category.units[1]);
    }
  };

  const handleConvert = () => {
    try {
      const value = parseFloat(inputValue);
      if (isNaN(value)) {
        setResult('Invalid input');
        return;
      }
      
      const convertedValue = convertUnit(value, fromUnit, toUnit, selectedCategory.name);
      setResult(convertedValue.toString());
    } catch (error) {
      setResult('Conversion error');
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (result) {
      setInputValue(result);
      setResult(inputValue);
    }
  };

  React.useEffect(() => {
    handleConvert();
  }, [inputValue, fromUnit, toUnit, selectedCategory]);

  return (
    <div className="unit-converter bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Unit Converter</h2>
      
      {/* Category Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={selectedCategory.name}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {unitCategories.map((category) => (
            <option key={category.name} value={category.name} className="bg-gray-800 text-white">
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Conversion Interface */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* From Unit */}
        <div>
          <label className="block text-sm font-medium mb-2">From</label>
          <select
            value={fromUnit.name}
            onChange={(e) => setFromUnit(selectedCategory.units.find(u => u.name === e.target.value)!)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          >
            {selectedCategory.units.map((unit) => (
              <option key={unit.name} value={unit.name} className="bg-gray-800 text-white">
                {unit.name} ({unit.symbol})
              </option>
            ))}
          </select>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder="Enter value"
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapUnits}
            className="p-3 bg-blue-500/80 hover:bg-blue-400/80 rounded-full transition-all duration-200 hover:scale-110"
            title="Swap units"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* To Unit */}
        <div>
          <label className="block text-sm font-medium mb-2">To</label>
          <select
            value={toUnit.name}
            onChange={(e) => setToUnit(selectedCategory.units.find(u => u.name === e.target.value)!)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          >
            {selectedCategory.units.map((unit) => (
              <option key={unit.name} value={unit.name} className="bg-gray-800 text-white">
                {unit.name} ({unit.symbol})
              </option>
            ))}
          </select>
          <div className="w-full p-3 bg-white/5 border border-white/20 rounded-lg font-mono">
            {result || '0'}
          </div>
        </div>
      </div>

      {/* Result Display */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg text-center">
        <div className="text-lg">
          <span className="font-mono">{inputValue}</span>
          <span className="mx-2 opacity-60">{fromUnit.symbol}</span>
          <span className="mx-2">=</span>
          <span className="font-mono font-bold">{result}</span>
          <span className="mx-2 opacity-60">{toUnit.symbol}</span>
        </div>
      </div>
    </div>
  );
};