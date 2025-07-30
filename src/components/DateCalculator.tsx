import React, { useState } from 'react';
import { calculateDateDifference, addDaysToDate, subtractDaysFromDate, formatDate, getWeekday, getBusinessDays } from '../utils/dateUtils';

export const DateCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<'difference' | 'add' | 'subtract'>('difference');
  const [date1, setDate1] = useState(new Date().toISOString().split('T')[0]);
  const [date2, setDate2] = useState(new Date().toISOString().split('T')[0]);
  const [days, setDays] = useState('30');
  const [result, setResult] = useState('');

  const handleCalculate = () => {
    try {
      switch (calculationType) {
        case 'difference':
          const diff = calculateDateDifference(date1, date2);
          const businessDays = getBusinessDays(date1, date2);
          setResult(`${diff} (${businessDays} business days)`);
          break;
          
        case 'add':
          const addedDate = addDaysToDate(date1, parseInt(days));
          const addedFormatted = formatDate(new Date(addedDate));
          const addedWeekday = getWeekday(addedDate);
          setResult(`${addedFormatted} (${addedWeekday})`);
          break;
          
        case 'subtract':
          const subtractedDate = subtractDaysFromDate(date1, parseInt(days));
          const subtractedFormatted = formatDate(new Date(subtractedDate));
          const subtractedWeekday = getWeekday(subtractedDate);
          setResult(`${subtractedFormatted} (${subtractedWeekday})`);
          break;
      }
    } catch (error) {
      setResult('Calculation error');
    }
  };

  React.useEffect(() => {
    handleCalculate();
  }, [calculationType, date1, date2, days]);

  return (
    <div className="date-calculator bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Date Calculator</h2>
      
      {/* Calculation Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Calculation Type</label>
        <div className="flex space-x-4">
          {[
            { key: 'difference' as const, label: 'Date Difference' },
            { key: 'add' as const, label: 'Add Days' },
            { key: 'subtract' as const, label: 'Subtract Days' }
          ].map((type) => (
            <button
              key={type.key}
              onClick={() => setCalculationType(type.key)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                calculationType === type.key
                  ? 'bg-blue-500/80 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white/80'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-4 mb-6">
        {calculationType === 'difference' ? (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Number of Days</label>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter number of days"
              />
            </div>
          </>
        )}
      </div>

      {/* Result Display */}
      <div className="p-4 bg-white/5 rounded-lg text-center">
        <div className="text-sm opacity-60 mb-2">Result</div>
        <div className="text-lg font-medium">
          {result || 'Enter dates to calculate'}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { label: 'Today', action: () => setDate1(new Date().toISOString().split('T')[0]) },
          { label: 'Yesterday', action: () => setDate1(new Date(Date.now() - 86400000).toISOString().split('T')[0]) },
          { label: 'Tomorrow', action: () => setDate1(new Date(Date.now() + 86400000).toISOString().split('T')[0]) },
          { label: 'Next Week', action: () => setDate1(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]) }
        ].map((quickAction) => (
          <button
            key={quickAction.label}
            onClick={quickAction.action}
            className="px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200"
          >
            {quickAction.label}
          </button>
        ))}
      </div>
    </div>
  );
};