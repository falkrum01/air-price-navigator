
export interface Hotel {
  id: string;
  name: string;
  location: string;
  checkIn: Date;
  checkOut: Date;
  roomType: string;
  guestCount: number;
  pricePerNight: number;
  totalPrice: number;
  amenities: string[];
  image: string;
  rating: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Hostel {
  id: string;
  name: string;
  location: string;
  checkIn: Date;
  checkOut: Date;
  bedType: string;
  guestCount: number;
  pricePerNight: number;
  totalPrice: number;
  amenities: string[];
  image: string;
  rating: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Cab {
  id: string;
  type: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: Date;
  price: number;
  driverName?: string;
  vehicleNumber?: string;
  estimatedTime: string;
  distance: string;
  coordinates: {
    pickup: {
      lat: number;
      lng: number;
    };
    dropoff: {
      lat: number;
      lng: number;
    };
  };
}

export interface BookingConfirmation {
  bookingId: string;
  userId: string;
  flightDetails?: {
    airline: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    origin: string;
    destination: string;
  };
  accommodationDetails?: {
    type: 'hotel' | 'hostel';
    name: string;
    location: string;
    checkIn: string;
    checkOut: string;
    roomType?: string;
    bedType?: string;
  };
  transportDetails?: {
    type: string;
    pickupLocation: string;
    dropoffLocation: string;
    pickupTime: string;
  };
  totalPrice: number;
  createdAt: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
  pdfUrl?: string;
}
