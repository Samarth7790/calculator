import React, { useState, useEffect } from 'react';
import { currencies, convertCurrency, fetchExchangeRates, ExchangeRates } from '../utils/currencyUtils';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';

export const CurrencyConverter: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState(currencies[0]);
  const [toCurrency, setToCurrency] = useState(currencies[1]);
  const [amount, setAmount] = useState('100');
  const [result, setResult] = useState('');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadExchangeRates = async () => {
    setIsLoading(true);
    try {
      const rates = await fetchExchangeRates();
      setExchangeRates(rates);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load exchange rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvert = () => {
    try {
      const value = parseFloat(amount);
      if (isNaN(value)) {
        setResult('Invalid amount');
        return;
      }

      const convertedValue = convertCurrency(value, fromCurrency.code, toCurrency.code, exchangeRates);
      setResult(convertedValue.toFixed(2));
    } catch (error) {
      setResult('Conversion error');
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    if (result) {
      setAmount(result);
    }
  };

  useEffect(() => {
    loadExchangeRates();
  }, []);

  useEffect(() => {
    if (Object.keys(exchangeRates).length > 0) {
      handleConvert();
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  return (
    <div className="currency-converter bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Currency Converter</h2>
        <button
          onClick={loadExchangeRates}
          disabled={isLoading}
          className="p-2 bg-blue-500/80 hover:bg-blue-400/80 rounded-lg transition-all duration-200 disabled:opacity-50"
          title="Refresh exchange rates"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="text-xs opacity-60 mb-4 text-center">
          Rates updated: {lastUpdated.toLocaleString()}
        </div>
      )}

      {/* Conversion Interface */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* From Currency */}
        <div>
          <label className="block text-sm font-medium mb-2">From</label>
          <select
            value={fromCurrency.code}
            onChange={(e) => setFromCurrency(currencies.find(c => c.code === e.target.value)!)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code} className="bg-gray-800 text-white">
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder="Enter amount"
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapCurrencies}
            className="p-3 bg-blue-500/80 hover:bg-blue-400/80 rounded-full transition-all duration-200 hover:scale-110"
            title="Swap currencies"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* To Currency */}
        <div>
          <label className="block text-sm font-medium mb-2">To</label>
          <select
            value={toCurrency.code}
            onChange={(e) => setToCurrency(currencies.find(c => c.code === e.target.value)!)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code} className="bg-gray-800 text-white">
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
          <div className="w-full p-3 bg-white/5 border border-white/20 rounded-lg font-mono">
            {result || '0.00'}
          </div>
        </div>
      </div>

      {/* Result Display */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg text-center">
        <div className="text-lg">
          <span className="font-mono">{fromCurrency.symbol}{amount}</span>
          <span className="mx-2 opacity-60">({fromCurrency.code})</span>
          <span className="mx-2">=</span>
          <span className="font-mono font-bold">{toCurrency.symbol}{result}</span>
          <span className="mx-2 opacity-60">({toCurrency.code})</span>
        </div>
        
        {/* Exchange Rate */}
        {exchangeRates[fromCurrency.code] && exchangeRates[toCurrency.code] && (
          <div className="text-sm opacity-60 mt-2">
            1 {fromCurrency.code} = {(exchangeRates[toCurrency.code] / exchangeRates[fromCurrency.code]).toFixed(4)} {toCurrency.code}
          </div>
        )}
      </div>
    </div>
  );
};