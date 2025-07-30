export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' }
];

export interface ExchangeRates {
  [key: string]: number;
}

// Mock exchange rates for demonstration
// In a real app, you would fetch these from an API like exchangerate-api.com
export const mockExchangeRates: ExchangeRates = {
  'USD': 1.0,
  'EUR': 0.85,
  'GBP': 0.73,
  'JPY': 110.0,
  'AUD': 1.35,
  'CAD': 1.25,
  'CHF': 0.92,
  'CNY': 6.45,
  'SEK': 8.75,
  'NZD': 1.42,
  'MXN': 20.5,
  'SGD': 1.35,
  'HKD': 7.8,
  'NOK': 8.5,
  'TRY': 8.2,
  'RUB': 73.5,
  'INR': 74.2,
  'BRL': 5.2,
  'ZAR': 14.8,
  'KRW': 1180.0
};

export const convertCurrency = (
  amount: number,
  fromCode: string,
  toCode: string,
  rates: ExchangeRates = mockExchangeRates
): number => {
  if (fromCode === toCode) return amount;
  
  const fromRate = rates[fromCode];
  const toRate = rates[toCode];
  
  if (!fromRate || !toRate) {
    throw new Error('Currency not supported');
  }
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
};

export const fetchExchangeRates = async (baseCurrency: string = 'USD'): Promise<ExchangeRates> => {
  try {
    // In a real app, you would use an actual API
    // const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    // const data = await response.json();
    // return data.rates;
    
    // For demo purposes, return mock rates with some randomness
    const rates: ExchangeRates = {};
    Object.keys(mockExchangeRates).forEach(currency => {
      const baseRate = mockExchangeRates[currency];
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      rates[currency] = baseRate * (1 + variation);
    });
    
    return rates;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    return mockExchangeRates;
  }
};