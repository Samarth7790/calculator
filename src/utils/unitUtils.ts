export interface UnitCategory {
  name: string;
  units: Unit[];
}

export interface Unit {
  name: string;
  symbol: string;
  factor: number; // Conversion factor to base unit
}

export const unitCategories: UnitCategory[] = [
  {
    name: 'Length',
    units: [
      { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
      { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
      { name: 'Meter', symbol: 'm', factor: 1 },
      { name: 'Kilometer', symbol: 'km', factor: 1000 },
      { name: 'Inch', symbol: 'in', factor: 0.0254 },
      { name: 'Foot', symbol: 'ft', factor: 0.3048 },
      { name: 'Yard', symbol: 'yd', factor: 0.9144 },
      { name: 'Mile', symbol: 'mi', factor: 1609.344 }
    ]
  },
  {
    name: 'Weight',
    units: [
      { name: 'Milligram', symbol: 'mg', factor: 0.001 },
      { name: 'Gram', symbol: 'g', factor: 1 },
      { name: 'Kilogram', symbol: 'kg', factor: 1000 },
      { name: 'Ounce', symbol: 'oz', factor: 28.3495 },
      { name: 'Pound', symbol: 'lb', factor: 453.592 },
      { name: 'Stone', symbol: 'st', factor: 6350.29 },
      { name: 'Ton', symbol: 't', factor: 1000000 }
    ]
  },
  {
    name: 'Temperature',
    units: [
      { name: 'Celsius', symbol: '°C', factor: 1 },
      { name: 'Fahrenheit', symbol: '°F', factor: 1 },
      { name: 'Kelvin', symbol: 'K', factor: 1 }
    ]
  },
  {
    name: 'Volume',
    units: [
      { name: 'Milliliter', symbol: 'ml', factor: 0.001 },
      { name: 'Liter', symbol: 'l', factor: 1 },
      { name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
      { name: 'Fluid Ounce', symbol: 'fl oz', factor: 0.0295735 },
      { name: 'Cup', symbol: 'cup', factor: 0.236588 },
      { name: 'Pint', symbol: 'pt', factor: 0.473176 },
      { name: 'Quart', symbol: 'qt', factor: 0.946353 },
      { name: 'Gallon', symbol: 'gal', factor: 3.78541 }
    ]
  },
  {
    name: 'Area',
    units: [
      { name: 'Square Millimeter', symbol: 'mm²', factor: 0.000001 },
      { name: 'Square Centimeter', symbol: 'cm²', factor: 0.0001 },
      { name: 'Square Meter', symbol: 'm²', factor: 1 },
      { name: 'Square Kilometer', symbol: 'km²', factor: 1000000 },
      { name: 'Square Inch', symbol: 'in²', factor: 0.00064516 },
      { name: 'Square Foot', symbol: 'ft²', factor: 0.092903 },
      { name: 'Square Yard', symbol: 'yd²', factor: 0.836127 },
      { name: 'Acre', symbol: 'acre', factor: 4046.86 },
      { name: 'Hectare', symbol: 'ha', factor: 10000 }
    ]
  }
];

export const convertUnit = (value: number, fromUnit: Unit, toUnit: Unit, category: string): number => {
  if (category === 'Temperature') {
    return convertTemperature(value, fromUnit.symbol, toUnit.symbol);
  }
  
  // Convert to base unit, then to target unit
  const baseValue = value * fromUnit.factor;
  return baseValue / toUnit.factor;
};

const convertTemperature = (value: number, from: string, to: string): number => {
  let celsius: number;
  
  // Convert to Celsius first
  switch (from) {
    case '°C':
      celsius = value;
      break;
    case '°F':
      celsius = (value - 32) * 5 / 9;
      break;
    case 'K':
      celsius = value - 273.15;
      break;
    default:
      celsius = value;
  }
  
  // Convert from Celsius to target
  switch (to) {
    case '°C':
      return celsius;
    case '°F':
      return celsius * 9 / 5 + 32;
    case 'K':
      return celsius + 273.15;
    default:
      return celsius;
  }
};