
export interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  website: string;
  websiteLogo: string;
}

export interface PricePrediction {
  date: string;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  recommendation: 'buy' | 'wait' | 'neutral';
  confidence: number;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: 'economy' | 'business' | 'first';
}

export interface FilterParams {
  airlines: string[];
  maxPrice?: number;
  maxStops?: number;
  websites?: string[];
}
