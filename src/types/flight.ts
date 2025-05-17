
export interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  origin: string;
  destination: string;
  departureDate: string; // Added this field
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  website: string;
  websiteLogo: string;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: string;
}
