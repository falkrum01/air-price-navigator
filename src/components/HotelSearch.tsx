import React, { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer, DirectionsService, useJsApiLoader } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, MapPin, Star, Check, Calendar, Users, Map, Navigation, Plane, LineChart, Building, Car } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useBookingContext } from "@/contexts/BookingContext";

// Define types
interface Hotel {
  id: string;
  name: string;
  rating: number;
  pricePerNight: number;
  location: string;
  address: string;
  amenities: string[];
  imageUrl: string;
  roomType: string;
  distance: string;
  timeFromAirport: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  availableCabs: {
    type: string;
    price: number;
    estimatedTime: string;
  }[];
}

// Default city
const defaultCity = "Hyderabad";

// Define city data
const cityData = {
  "Hyderabad": {
    center: { lat: 17.3850, lng: 78.4867 },
    airport: {
      name: "Rajiv Gandhi International Airport",
      location: "Shamshabad, Hyderabad",
      coordinates: { lat: 17.2403, lng: 78.4294 }
    },
    hostelSearchText: "Best hostels in Hyderabad near city center"
  },
  "Bangalore": {
    center: { lat: 12.9716, lng: 77.5946 },
    airport: {
      name: "Kempegowda International Airport",
      location: "Devanahalli, Bangalore",
      coordinates: { lat: 13.1986, lng: 77.7066 }
    },
    hostelSearchText: "Best hostels in Bangalore near MG Road"
  },
  "Mumbai": {
    center: { lat: 19.0760, lng: 72.8777 },
    airport: {
      name: "Chhatrapati Shivaji Maharaj International Airport",
      location: "Mumbai",
      coordinates: { lat: 19.0896, lng: 72.8656 }
    },
    hostelSearchText: "Best hostels in Mumbai near Colaba"
  },
  "Delhi": {
    center: { lat: 28.6139, lng: 77.2090 },
    airport: {
      name: "Indira Gandhi International Airport",
      location: "New Delhi",
      coordinates: { lat: 28.5562, lng: 77.1000 }
    },
    hostelSearchText: "Best hostels in Delhi near Connaught Place"
  },
  "Chennai": {
    center: { lat: 13.0827, lng: 80.2707 },
    airport: {
      name: "Chennai International Airport",
      location: "Meenambakkam, Chennai",
      coordinates: { lat: 12.9932, lng: 80.1709 }
    },
    hostelSearchText: "Best hostels in Chennai near Marina Beach"
  },
  "Kolkata": {
    center: { lat: 22.5726, lng: 88.3639 },
    airport: {
      name: "Netaji Subhas Chandra Bose International Airport",
      location: "Dum Dum, Kolkata",
      coordinates: { lat: 22.6520, lng: 88.4463 }
    },
    hostelSearchText: "Best hostels in Kolkata near Park Street"
  },
  "Ahmedabad": {
    center: { lat: 23.0225, lng: 72.5714 },
    airport: {
      name: "Sardar Vallabhbhai Patel International Airport",
      location: "Ahmedabad",
      coordinates: { lat: 23.0771, lng: 72.6345 }
    },
    hostelSearchText: "Best hostels in Ahmedabad near Sabarmati Riverfront"
  },
  "Pune": {
    center: { lat: 18.5204, lng: 73.8567 },
    airport: {
      name: "Pune International Airport",
      location: "Lohegaon, Pune",
      coordinates: { lat: 18.5793, lng: 73.9089 }
    },
    hostelSearchText: "Best hostels in Pune near Koregaon Park"
  },
  "Jaipur": {
    center: { lat: 26.9124, lng: 75.7873 },
    airport: {
      name: "Jaipur International Airport",
      location: "Sanganer, Jaipur",
      coordinates: { lat: 26.8242, lng: 75.8103 }
    },
    hostelSearchText: "Best hostels in Jaipur near Hawa Mahal"
  },
  "Goa": {
    center: { lat: 15.2993, lng: 74.1240 },
    airport: {
      name: "Goa International Airport",
      location: "Dabolim, Goa",
      coordinates: { lat: 15.3808, lng: 73.8326 }
    },
    hostelSearchText: "Best hostels in Goa near Calangute Beach"
  },
};

// City-specific hotel data (simplified)
const cityHotels: Record<string, Hotel[]> = {
  "Hyderabad": [
    {
      id: "h1",
      name: "Grand Hyatt",
      rating: 4.8,
      pricePerNight: 5600,
      location: "Banjara Hills, Hyderabad",
      address: "Road No. 2, Banjara Hills, Hyderabad",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant"],
      imageUrl: "https://via.placeholder.com/300x200?text=Grand+Hyatt",
      roomType: "Deluxe Suite",
      distance: "24 km",
      timeFromAirport: "35 min",
      coordinates: { lat: 17.4156, lng: 78.4347 },
      availableCabs: [
        { type: "Economy", price: 450, estimatedTime: "40 min" },
        { type: "Premium", price: 650, estimatedTime: "35 min" },
        { type: "SUV", price: 850, estimatedTime: "35 min" }
      ]
    },
    {
      id: "h4",
      name: "ITC Kohenur",
      rating: 4.9,
      pricePerNight: 8500,
      location: "Madhapur, Hyderabad",
      address: "HITEC City, Hyderabad",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Business Center"],
      imageUrl: "https://via.placeholder.com/300x200?text=ITC+Kohenur",
      roomType: "Luxury Suite",
      distance: "27 km",
      timeFromAirport: "45 min",
      coordinates: { lat: 17.4424, lng: 78.3815 },
      availableCabs: [
        { type: "Economy", price: 400, estimatedTime: "35 min" },
        { type: "Premium", price: 600, estimatedTime: "30 min" },
        { type: "SUV", price: 750, estimatedTime: "30 min" }
      ]
    }
  ],
  "Delhi": [
    {
      id: "d1",
      name: "The Leela Palace",
      rating: 4.9,
      pricePerNight: 9800,
      location: "Diplomatic Enclave, New Delhi",
      address: "Diplomatic Enclave, Chanakyapuri, New Delhi",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Bar"],
      imageUrl: "https://via.placeholder.com/300x200?text=The+Leela+Palace",
      roomType: "Premier Room",
      distance: "13 km",
      timeFromAirport: "22 min",
      coordinates: { lat: 28.5977, lng: 77.1700 },
      availableCabs: [
        { type: "Economy", price: 350, estimatedTime: "25 min" },
        { type: "Premium", price: 500, estimatedTime: "22 min" },
        { type: "SUV", price: 650, estimatedTime: "22 min" }
      ]
    },
    {
      id: "d2",
      name: "Taj Palace",
      rating: 4.7,
      pricePerNight: 8500,
      location: "Diplomatic Enclave, New Delhi",
      address: "2 Sardar Patel Marg, Diplomatic Enclave, New Delhi",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Gym"],
      imageUrl: "https://via.placeholder.com/300x200?text=Taj+Palace",
      roomType: "Deluxe Room",
      distance: "14 km",
      timeFromAirport: "25 min",
      coordinates: { lat: 28.5994, lng: 77.1722 },
      availableCabs: [
        { type: "Economy", price: 360, estimatedTime: "28 min" },
        { type: "Premium", price: 510, estimatedTime: "25 min" },
        { type: "SUV", price: 660, estimatedTime: "25 min" }
      ]
    }
  ],
  "Mumbai": [
    {
      id: "m1",
      name: "Taj Mahal Palace",
      rating: 4.9,
      pricePerNight: 11000,
      location: "Apollo Bunder, Mumbai",
      address: "Apollo Bunder, Colaba, Mumbai",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Bar"],
      imageUrl: "https://via.placeholder.com/300x200?text=Taj+Mahal+Palace",
      roomType: "Luxury Room",
      distance: "27 km",
      timeFromAirport: "40 min",
      coordinates: { lat: 18.9217, lng: 72.8315 },
      availableCabs: [
        { type: "Economy", price: 550, estimatedTime: "50 min" },
        { type: "Premium", price: 750, estimatedTime: "45 min" },
        { type: "SUV", price: 950, estimatedTime: "45 min" }
      ]
    },
    {
      id: "m2",
      name: "Trident Nariman Point",
      rating: 4.7,
      pricePerNight: 9000,
      location: "Nariman Point, Mumbai",
      address: "Nariman Point, Mumbai",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant"],
      imageUrl: "https://via.placeholder.com/300x200?text=Trident+Nariman",
      roomType: "Deluxe Room",
      distance: "25 km",
      timeFromAirport: "42 min",
      coordinates: { lat: 18.9256, lng: 72.8205 },
      availableCabs: [
        { type: "Economy", price: 500, estimatedTime: "45 min" },
        { type: "Premium", price: 700, estimatedTime: "42 min" },
        { type: "SUV", price: 900, estimatedTime: "42 min" }
      ]
    }
  ],
  "Bangalore": [
    {
      id: "b1",
      name: "Taj West End",
      rating: 4.8,
      pricePerNight: 9000,
      location: "Race Course Road, Bangalore",
      address: "Race Course Road, High Grounds, Bangalore",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Bar"],
      imageUrl: "https://via.placeholder.com/300x200?text=Taj+West+End",
      roomType: "Luxury Room",
      distance: "31 km",
      timeFromAirport: "55 min",
      coordinates: { lat: 12.9842, lng: 77.5866 },
      availableCabs: [
        { type: "Economy", price: 650, estimatedTime: "60 min" },
        { type: "Premium", price: 850, estimatedTime: "55 min" },
        { type: "SUV", price: 1050, estimatedTime: "55 min" }
      ]
    },
    {
      id: "b2",
      name: "The Oberoi",
      rating: 4.9,
      pricePerNight: 10500,
      location: "MG Road, Bangalore",
      address: "37-39, MG Road, Bangalore",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Gym"],
      imageUrl: "https://via.placeholder.com/300x200?text=The+Oberoi",
      roomType: "Premier Room",
      distance: "32 km",
      timeFromAirport: "60 min",
      coordinates: { lat: 12.9733, lng: 77.6197 },
      availableCabs: [
        { type: "Economy", price: 680, estimatedTime: "65 min" },
        { type: "Premium", price: 880, estimatedTime: "60 min" },
        { type: "SUV", price: 1080, estimatedTime: "60 min" }
      ]
    }
  ],
  "Chennai": [
    {
      id: "c1",
      name: "Taj Coromandel",
      rating: 4.7,
      pricePerNight: 8500,
      location: "Nungambakkam, Chennai",
      address: "37, Mahatma Gandhi Road, Nungambakkam, Chennai",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Bar"],
      imageUrl: "https://via.placeholder.com/300x200?text=Taj+Coromandel",
      roomType: "Superior Room",
      distance: "16 km",
      timeFromAirport: "30 min",
      coordinates: { lat: 13.0614, lng: 80.2516 },
      availableCabs: [
        { type: "Economy", price: 400, estimatedTime: "35 min" },
        { type: "Premium", price: 600, estimatedTime: "30 min" },
        { type: "SUV", price: 800, estimatedTime: "30 min" }
      ]
    },
    {
      id: "c2",
      name: "ITC Grand Chola",
      rating: 4.8,
      pricePerNight: 9500,
      location: "Guindy, Chennai",
      address: "Mount Road, Guindy, Chennai",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Gym", "Business Center"],
      imageUrl: "https://via.placeholder.com/300x200?text=ITC+Grand+Chola",
      roomType: "Executive Club Room",
      distance: "10 km",
      timeFromAirport: "20 min",
      coordinates: { lat: 13.0105, lng: 80.2156 },
      availableCabs: [
        { type: "Economy", price: 350, estimatedTime: "25 min" },
        { type: "Premium", price: 550, estimatedTime: "20 min" },
        { type: "SUV", price: 750, estimatedTime: "20 min" }
      ]
    }
  ],
  "Kolkata": [
    {
      id: "k1",
      name: "The Oberoi Grand",
      rating: 4.8,
      pricePerNight: 8000,
      location: "Esplanade, Kolkata",
      address: "15, Jawaharlal Nehru Road, Kolkata",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Bar"],
      imageUrl: "https://via.placeholder.com/300x200?text=Oberoi+Grand",
      roomType: "Deluxe Room",
      distance: "18 km",
      timeFromAirport: "45 min",
      coordinates: { lat: 22.5600, lng: 88.3517 },
      availableCabs: [
        { type: "Economy", price: 450, estimatedTime: "50 min" },
        { type: "Premium", price: 650, estimatedTime: "45 min" },
        { type: "SUV", price: 850, estimatedTime: "45 min" }
      ]
    },
    {
      id: "k2",
      name: "Taj Bengal",
      rating: 4.7,
      pricePerNight: 7500,
      location: "Alipore, Kolkata",
      address: "34B, Belvedere Road, Alipore, Kolkata",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Gym"],
      imageUrl: "https://via.placeholder.com/300x200?text=Taj+Bengal",
      roomType: "Superior Room",
      distance: "22 km",
      timeFromAirport: "55 min",
      coordinates: { lat: 22.5354, lng: 88.3410 },
      availableCabs: [
        { type: "Economy", price: 500, estimatedTime: "60 min" },
        { type: "Premium", price: 700, estimatedTime: "55 min" },
        { type: "SUV", price: 900, estimatedTime: "55 min" }
      ]
    }
  ],
  "Ahmedabad": [
    {
      id: "a1",
      name: "Hyatt Regency",
      rating: 4.6,
      pricePerNight: 5500,
      location: "Ashram Road, Ahmedabad",
      address: "17/A, Ashram Road, Ahmedabad",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Gym"],
      imageUrl: "https://via.placeholder.com/300x200?text=Hyatt+Regency",
      roomType: "King Room",
      distance: "8 km",
      timeFromAirport: "15 min",
      coordinates: { lat: 23.0412, lng: 72.5624 },
      availableCabs: [
        { type: "Economy", price: 250, estimatedTime: "18 min" },
        { type: "Premium", price: 400, estimatedTime: "15 min" },
        { type: "SUV", price: 550, estimatedTime: "15 min" }
      ]
    },
    {
      id: "a2",
      name: "Taj Skyline",
      rating: 4.7,
      pricePerNight: 6000,
      location: "Sindhubhavan Road, Ahmedabad",
      address: "Sindhubhavan Road, Ahmedabad",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Business Center"],
      imageUrl: "https://via.placeholder.com/300x200?text=Taj+Skyline",
      roomType: "Deluxe Room",
      distance: "10 km",
      timeFromAirport: "20 min",
      coordinates: { lat: 23.0482, lng: 72.5271 },
      availableCabs: [
        { type: "Economy", price: 300, estimatedTime: "22 min" },
        { type: "Premium", price: 450, estimatedTime: "20 min" },
        { type: "SUV", price: 600, estimatedTime: "20 min" }
      ]
    }
  ],
  "Pune": [
    {
      id: "p1",
      name: "JW Marriott",
      rating: 4.7,
      pricePerNight: 7000,
      location: "Senapati Bapat Road, Pune",
      address: "Senapati Bapat Road, Pune",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Bar", "Gym"],
      imageUrl: "https://via.placeholder.com/300x200?text=JW+Marriott",
      roomType: "Deluxe Room",
      distance: "9 km",
      timeFromAirport: "15 min",
      coordinates: { lat: 18.5351, lng: 73.8001 },
      availableCabs: [
        { type: "Economy", price: 300, estimatedTime: "18 min" },
        { type: "Premium", price: 450, estimatedTime: "15 min" },
        { type: "SUV", price: 600, estimatedTime: "15 min" }
      ]
    },
    {
      id: "p2",
      name: "The Westin Pune",
      rating: 4.6,
      pricePerNight: 6500,
      location: "Koregaon Park, Pune",
      address: "36/3-B, Koregaon Park Annexe, Pune",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Gym"],
      imageUrl: "https://via.placeholder.com/300x200?text=Westin+Pune",
      roomType: "Premium Room",
      distance: "5 km",
      timeFromAirport: "10 min",
      coordinates: { lat: 18.5452, lng: 73.8903 },
      availableCabs: [
        { type: "Economy", price: 250, estimatedTime: "12 min" },
        { type: "Premium", price: 400, estimatedTime: "10 min" },
        { type: "SUV", price: 550, estimatedTime: "10 min" }
      ]
    }
  ],
  "Jaipur": [
    {
      id: "j1",
      name: "Taj Rambagh Palace",
      rating: 4.9,
      pricePerNight: 9500,
      location: "Bhawani Singh Road, Jaipur",
      address: "Bhawani Singh Road, Jaipur",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Bar", "Heritage Tours"],
      imageUrl: "https://via.placeholder.com/300x200?text=Rambagh+Palace",
      roomType: "Palace Room",
      distance: "13 km",
      timeFromAirport: "23 min",
      coordinates: { lat: 26.8905, lng: 75.8082 },
      availableCabs: [
        { type: "Economy", price: 350, estimatedTime: "25 min" },
        { type: "Premium", price: 550, estimatedTime: "23 min" },
        { type: "SUV", price: 750, estimatedTime: "23 min" }
      ]
    },
    {
      id: "j2",
      name: "ITC Rajputana",
      rating: 4.6,
      pricePerNight: 6500,
      location: "Palace Road, Jaipur",
      address: "Palace Road, Jaipur",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Gym"],
      imageUrl: "https://via.placeholder.com/300x200?text=ITC+Rajputana",
      roomType: "Executive Club Room",
      distance: "11 km",
      timeFromAirport: "20 min",
      coordinates: { lat: 26.9281, lng: 75.7861 },
      availableCabs: [
        { type: "Economy", price: 320, estimatedTime: "22 min" },
        { type: "Premium", price: 520, estimatedTime: "20 min" },
        { type: "SUV", price: 720, estimatedTime: "20 min" }
      ]
    }
  ],
  "Goa": [
    {
      id: "g1",
      name: "Taj Exotica",
      rating: 4.8,
      pricePerNight: 8500,
      location: "Benaulim, South Goa",
      address: "Benaulim Beach, Goa",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Bar", "Beach Access"],
      imageUrl: "https://via.placeholder.com/300x200?text=Taj+Exotica",
      roomType: "Garden Villa",
      distance: "27 km",
      timeFromAirport: "40 min",
      coordinates: { lat: 15.2721, lng: 73.8903 },
      availableCabs: [
        { type: "Economy", price: 800, estimatedTime: "45 min" },
        { type: "Premium", price: 1000, estimatedTime: "40 min" },
        { type: "SUV", price: 1200, estimatedTime: "40 min" }
      ]
    },
    {
      id: "g2",
      name: "W Goa",
      rating: 4.7,
      pricePerNight: 9000,
      location: "Vagator, North Goa",
      address: "Vagator Beach, Goa",
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Bar", "Beach Access"],
      imageUrl: "https://via.placeholder.com/300x200?text=W+Goa",
      roomType: "Wonderful Room",
      distance: "38 km",
      timeFromAirport: "55 min",
      coordinates: { lat: 15.5963, lng: 73.7470 },
      availableCabs: [
        { type: "Economy", price: 950, estimatedTime: "60 min" },
        { type: "Premium", price: 1150, estimatedTime: "55 min" },
        { type: "SUV", price: 1350, estimatedTime: "55 min" }
      ]
    }
  ]
};

// Google Maps API key from environment variable
const GOOGLE_MAPS_API_KEY = "AIzaSyC6k680hSHNQB2QABFuwe4MyisofNSZIc4";

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px'
};

// Libraries to load with Google Maps
const libraries = ['places', 'geometry'] as ("places" | "drawing" | "geometry" | "visualization")[]; // Include places and geometry libraries

// Real-time Google Maps component with directions
const HotelMap: React.FC<{
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  onSelectHotel: (hotel: Hotel) => void;
  city: string;
}> = ({ hotels, selectedHotel, onSelectHotel, city }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });
  
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [infoWindow, setInfoWindow] = useState<{ hotel: Hotel; position: { lat: number; lng: number } } | null>(null);
  const [selectedCabType, setSelectedCabType] = useState<string | null>(null);
  
  // Get city center and airport coordinates
  const cityCenter = cityData[city]?.center || cityData[defaultCity].center;
  const airportCoordinates = cityData[city]?.airport.coordinates || cityData[defaultCity].airport.coordinates;
  const airportName = cityData[city]?.airport.name || cityData[defaultCity].airport.name;

  // Request directions when a hotel is selected
  useEffect(() => {
    if (isLoaded && selectedHotel && airportCoordinates) {
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route({
        origin: new google.maps.LatLng(airportCoordinates.lat, airportCoordinates.lng),
        destination: new google.maps.LatLng(selectedHotel.coordinates.lat, selectedHotel.coordinates.lng),
        travelMode: google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
          // Set the first cab type as selected by default
          if (selectedHotel.availableCabs.length > 0) {
            setSelectedCabType(selectedHotel.availableCabs[0].type);
          }
        } else {
          console.error('Directions request failed: ' + status);
        }
      });
    } else {
      setDirections(null);
      setSelectedCabType(null);
    }
  }, [isLoaded, selectedHotel, airportCoordinates]);

  // Handle marker click
  const handleMarkerClick = (hotel: Hotel) => {
    setInfoWindow({
      hotel,
      position: hotel.coordinates
    });
  };

  if (loadError) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-500">Error loading Google Maps. Please check your internet connection and try again.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="h-10 w-10 animate-spin text-airblue" />
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={selectedHotel ? selectedHotel.coordinates : cityCenter}
        zoom={12}
        onLoad={setMap}
        onUnmount={() => setMap(null)}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
        {/* Airport marker */}
        <Marker
          position={airportCoordinates}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new window.google.maps.Size(32, 32),
          }}
          title={airportName}
        />
        
        {/* Hotel markers */}
        {hotels.map(hotel => (
          <Marker
            key={hotel.id}
            position={hotel.coordinates}
            onClick={() => handleMarkerClick(hotel)}
            icon={{
              url: selectedHotel?.id === hotel.id
                ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new window.google.maps.Size(32, 32),
            }}
          />
        ))}
        
        {/* Info window */}
        {infoWindow && (
          <InfoWindow
            position={infoWindow.position}
            onCloseClick={() => setInfoWindow(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-semibold text-base">{infoWindow.hotel.name}</h3>
              <p className="text-xs text-gray-500">{infoWindow.hotel.address}</p>
              <div className="flex items-center text-xs mt-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="ml-1">{infoWindow.hotel.rating}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm font-medium">₹{infoWindow.hotel.pricePerNight}/night</p>
                <Button 
                  size="sm" 
                  variant="default" 
                  className="text-xs py-1 h-7"
                  onClick={() => {
                    onSelectHotel(infoWindow.hotel);
                    setInfoWindow(null);
                  }}
                >
                  Select
                </Button>
              </div>
            </div>
          </InfoWindow>
        )}
        
        {/* Directions from airport to selected hotel */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: selectedCabType === 'Economy' ? '#4CAF50' : 
                             selectedCabType === 'Premium' ? '#2196F3' : 
                             '#FF9800',
                strokeWeight: 5
              }
            }}
          />
        )}
      </GoogleMap>
      
      {/* Transport options */}
      {selectedHotel && directions && (
        <div className="mt-2 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Transport from {airportName}</h4>
            <p className="text-xs text-gray-500">
              {directions.routes[0].legs[0].distance?.text} • 
              {directions.routes[0].legs[0].duration?.text}
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {selectedHotel.availableCabs.map((cab) => (
              <Card 
                key={cab.type} 
                className={cn(
                  "border cursor-pointer",
                  selectedCabType === cab.type ? "border-airblue" : "border-gray-200"
                )}
                onClick={() => setSelectedCabType(cab.type)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">{cab.type}</div>
                    <Car className={cn(
                      "h-4 w-4",
                      selectedCabType === cab.type ? "text-airblue" : "text-gray-500"
                    )} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">₹{cab.price}</div>
                  <div className="text-xs text-gray-500">{cab.estimatedTime}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const HotelSearch: React.FC = () => {
  const [location, setLocation] = useState(defaultCity);
  const [checkin, setCheckin] = useState<Date>(new Date());
  const [checkout, setCheckout] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 2)));
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [mapVisible, setMapVisible] = useState(true);
  const [selectedCab, setSelectedCab] = useState<{type: string; price: number; estimatedTime: string} | null>(null);
  const { toast } = useToast();
  const { setHotelBooking } = useBookingContext();
  
  // Check if Google Maps API is loaded
  const { isLoaded: isGoogleMapsLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  // Function to search for hotels using Google Maps Places API
  const handleSearch = useCallback(() => {
    if (!location) {
      toast({
        title: "Please enter a location",
        description: "You need to specify a location to search for hotels",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSelectedHotel(null);
    
    // Check if Google Maps is loaded
    if (isGoogleMapsLoaded && window.google && window.google.maps) {
      console.log('Using Google Maps Places API to find hotels in', location);
      
      const cityCenter = cityData[location]?.center || cityData[defaultCity].center;
      const airportCoordinates = cityData[location]?.airport.coordinates || cityData[defaultCity].airport.coordinates;
      
      // Create a PlacesService instance
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      
      const request = {
        location: new window.google.maps.LatLng(cityCenter.lat, cityCenter.lng),
        radius: 15000, // 15km radius
        type: 'lodging',
        keyword: `hotel ${location}`
      };
      
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          // Map the places results to our Hotel interface
          const mappedHotels = results.slice(0, 10).map((place, index) => {
            const id = `dynamic-${location}-${index}`;
            const placeLocation = place.geometry?.location;
            const lat = placeLocation?.lat() || cityCenter.lat;
            const lng = placeLocation?.lng() || cityCenter.lng;
            
            // Calculate approximate distance from airport (straight line)
            const distanceInMeters = window.google.maps.geometry.spherical.computeDistanceBetween(
              new window.google.maps.LatLng(airportCoordinates.lat, airportCoordinates.lng),
              new window.google.maps.LatLng(lat, lng)
            );
            
            const distanceInKm = (distanceInMeters / 1000).toFixed(1);
            
            // Estimate travel time (rough estimate: 2 minutes per km)
            const estimatedMinutes = Math.ceil(parseFloat(distanceInKm) * 2);
            
            // Generate price based on rating and random factor
            const basePrice = 3000 + (place.rating || 3) * 1000;
            const priceVariation = Math.floor(Math.random() * 2000);
            const pricePerNight = Math.floor(basePrice + priceVariation);
            
            // Generate cab prices based on distance
            const economyPrice = Math.round(300 + parseFloat(distanceInKm) * 15);
            const premiumPrice = Math.round(economyPrice * 1.5);
            const suvPrice = Math.round(economyPrice * 2);
            
            return {
              id: id,
              name: place.name || `Hotel ${index + 1}`,
              rating: place.rating || 4.0,
              pricePerNight: pricePerNight,
              location: place.vicinity || `${location}`,
              address: place.vicinity || `${location}`,
              amenities: ["Wi-Fi", "Restaurant", "AC", "Parking"],
              imageUrl: place.photos?.[0]?.getUrl?.() || `https://via.placeholder.com/300x200?text=${encodeURIComponent(place.name || `Hotel ${index + 1}`)}`,
              roomType: "Standard Room",
              distance: `${distanceInKm} km`,
              timeFromAirport: `${estimatedMinutes} min`,
              coordinates: { lat, lng },
              availableCabs: [
                { type: "Economy", price: economyPrice, estimatedTime: `${estimatedMinutes} min` },
                { type: "Premium", price: premiumPrice, estimatedTime: `${Math.round(estimatedMinutes * 0.9)} min` },
                { type: "SUV", price: suvPrice, estimatedTime: `${Math.round(estimatedMinutes * 0.9)} min` }
              ]
            };
          });
          
          setHotels(mappedHotels);
          setLoading(false);
          
          toast({
            title: `${mappedHotels.length} hotels found in ${location}`,
            description: "Showing real hotels from Google Maps"
          });
        } else {
          // If Google Places API fails, fall back to mock data
          console.error('Places API failed, falling back to mock data:', status);
          const fallbackHotels = cityHotels[location] || [];
          setHotels(fallbackHotels);
          setLoading(false);
          
          toast({
            title: "Using fallback hotel data",
            description: "Could not retrieve real-time hotel data for this location.",
            variant: "destructive"
          });
        }
      });
    } else {
      // If Google Maps isn't loaded yet, fall back to mock data
      console.error('Google Maps not loaded, falling back to mock data');
      const fallbackHotels = cityHotels[location] || [];
      setHotels(fallbackHotels);
      setLoading(false);
      
      toast({
        title: "Google Maps API not ready",
        description: "Using mock data as Google Maps API is not fully loaded.",
        variant: "destructive"
      });
    }
  }, [location, toast, isGoogleMapsLoaded]);

  // Function to handle hotel selection
  const handleHotelSelect = useCallback((hotel: Hotel) => {
    setSelectedHotel(hotel);
    
    // If hotel has cab options, select the first one by default
    if (hotel.availableCabs && hotel.availableCabs.length > 0) {
      setSelectedCab(hotel.availableCabs[0]);
    }
    
    // Calculate total price for this hotel
    const nights = Math.max(1, Math.round((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24)));
    const totalPrice = hotel.pricePerNight * nights;
    
    // Save to booking context
    setHotelBooking({
      id: hotel.id,
      name: hotel.name,
      location: hotel.location,
      checkIn: checkin,
      checkOut: checkout,
      totalPrice: totalPrice,
      roomType: hotel.roomType,
      guestCount: guests,
      pricePerNight: hotel.pricePerNight,
      amenities: hotel.amenities,
      image: hotel.imageUrl,
      rating: hotel.rating,
      coordinates: hotel.coordinates
    });
    
    toast({
      title: "Hotel Selected",
      description: `${hotel.name} has been selected. Price: ₹${hotel.pricePerNight}/night`,
    });
  }, [toast, setHotelBooking, checkin, checkout, guests]);

  // Calculate total price for booking
  const calculateTotalPrice = useCallback(() => {
    if (!selectedHotel) return 0;
    
    const nights = Math.max(1, Math.round((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24)));
    return selectedHotel.pricePerNight * nights;
  }, [selectedHotel, checkin, checkout]);

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="hotels">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hotels">Hotels & Hostels</TabsTrigger>
          <TabsTrigger value="trends">Price Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="hotels" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <div className="flex gap-2">
                <div className="flex-grow">
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(cityData).map((city) => (
                        <SelectItem key={city} value={city}>
                          <div className="flex items-center">
                            <Building className="mr-2 h-4 w-4" />
                            <span>{city}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Check-in</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkin && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {checkin ? format(checkin, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={checkin}
                    onSelect={(date) => date && setCheckin(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Check-out</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkout && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {checkout ? format(checkout, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={checkout}
                    onSelect={(date) => date && setCheckout(date)}
                    initialFocus
                    disabled={(date) => date < checkin}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Guests & Rooms</label>
              <div className="grid grid-cols-2 gap-2">
                <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={rooms.toString()} onValueChange={(value) => setRooms(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rooms" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Room" : "Rooms"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <Button 
              onClick={handleSearch} 
              className="bg-airblue hover:bg-airblue/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Building className="mr-2 h-4 w-4" />
                  Search Hotels
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMapVisible(!mapVisible)}
              className="ml-2"
              title="Toggle Map View"
            >
              <Map className="h-3 w-3 mr-1" />
              {mapVisible ? "Hide Map" : "Show Map"}
            </Button>
          </div>
          
          {/* Hotel results section */}
          {loading ? (
            <div className="flex items-center justify-center h-80">
              <Loader2 className="h-10 w-10 animate-spin text-airblue" />
            </div>
          ) : (
            <>
              {/* Google Maps View */}
              {mapVisible && hotels.length > 0 && (
                <div className="mt-6 mb-6">
                  <HotelMap
                    hotels={hotels}
                    selectedHotel={selectedHotel}
                    onSelectHotel={handleHotelSelect}
                    city={location}
                  />
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Plane className="h-3 w-3 mr-1 text-airblue" />
                    <span className="mr-4">Airport</span>
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-1" />
                    <span className="mr-4">Hotels</span>
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-1" />
                    <span>Selected Hotel</span>
                  </div>
                </div>
              )}
              
              {/* Hotel Cards */}
              {hotels.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotels.map((hotel) => (
                    <Card 
                      key={hotel.id}
                      className={cn(
                        "overflow-hidden transition-colors cursor-pointer",
                        selectedHotel?.id === hotel.id ? "border-airblue" : "hover:border-airblue/50"
                      )}
                      onClick={() => handleHotelSelect(hotel)}
                    >
                      <div className="relative h-40 bg-gray-200">
                        <div 
                          className="h-full w-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${hotel.imageUrl})` }}
                        />
                        <div className="absolute top-2 right-2 bg-white rounded-full p-1.5">
                          {selectedHotel?.id === hotel.id ? <Check className="h-4 w-4" /> : null}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-semibold text-lg line-clamp-1">{hotel.name}</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-sm">{hotel.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-1">{hotel.location}</p>
                        <div className="flex items-center text-sm mb-2">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 mr-1" />
                          <span className="text-gray-500">{hotel.distance} from airport</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {hotel.amenities.slice(0, 3).map((amenity, i) => (
                            <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                              {amenity}
                            </span>
                          ))}
                          {hotel.amenities.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                              +{hotel.amenities.length - 3}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-gray-500 text-xs">Per night</p>
                            <p className="font-semibold text-lg">₹{hotel.pricePerNight}</p>
                          </div>
                          <Button 
                            variant={selectedHotel?.id === hotel.id ? "default" : "outline"} 
                            size="sm"
                          >
                            {selectedHotel?.id === hotel.id ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 mt-8">
                  <Building className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-gray-500">No hotels found. Try a different location or dates.</p>
                </div>
              )}
              
              {/* Selected Hotel Booking Details */}
              {selectedHotel && (
                <Card className="mt-8 border-airblue">
                  <CardHeader>
                    <CardTitle>Booking Details</CardTitle>
                    <CardDescription>Review your hotel booking and transportation options</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="col-span-2">
                        <h3 className="text-xl font-semibold">{selectedHotel.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{selectedHotel.address}</p>
                        
                        <div className="flex items-center mt-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm ml-1">{selectedHotel.rating}</span>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium">Check-in</h4>
                            <p className="text-sm">{format(checkin, "PPP")}</p>
                            <p className="text-xs text-gray-500">After 2:00 PM</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Check-out</h4>
                            <p className="text-sm">{format(checkout, "PPP")}</p>
                            <p className="text-xs text-gray-500">Before 12:00 PM</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium">Room Type</h4>
                          <p className="text-sm">{selectedHotel.roomType}</p>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium">Guests</h4>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-500 mr-1" />
                            <p className="text-sm">{guests} guests, {rooms} room{rooms > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        
                        <h4 className="text-sm font-medium mt-4 mb-2">Transportation Options from Airport</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedHotel.availableCabs.map((cab, index) => (
                            <Card key={index} className="border-gray-200">
                              <CardContent className="p-3">
                                <div className="flex justify-between items-center">
                                  <div className="text-sm font-medium">{cab.type}</div>
                                  <Car className="h-4 w-4 text-gray-500" />
                                </div>
                                <div className="text-xs text-gray-500 mt-1">₹{cab.price}</div>
                                <div className="text-xs text-gray-500">{cab.estimatedTime}</div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Card className="border-gray-200">
                          <CardContent className="p-4">
                            <h3 className="text-lg font-semibold">Price Summary</h3>
                            
                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Room Charges</span>
                                <span className="text-sm font-medium">₹{selectedHotel.pricePerNight.toLocaleString()} x {Math.round((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24))} night{Math.round((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24)) > 1 ? 's' : ''}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Taxes & Fees (18%)</span>
                                <span className="text-sm font-medium">₹{Math.round(calculateTotalPrice() * 0.18).toLocaleString()}</span>
                              </div>
                              <div className="border-t border-gray-200 pt-2 mt-2">
                                <div className="flex justify-between font-semibold">
                                  <span>Total</span>
                                  <span>₹{(calculateTotalPrice() + Math.round(calculateTotalPrice() * 0.18)).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            <Button className="w-full mt-4 bg-airblue hover:bg-airblue/90">
                              Book Now
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="trends" className="pt-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Hotel Price Trends</h2>
            <p className="text-gray-500">Track price changes and find the best time to book your stay</p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Historical Price Data for {location}</h3>
              <div className="h-80 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <LineChart className="h-12 w-12 mx-auto text-airblue mb-3" />
                  <p className="text-gray-600">Price trend visualization will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HotelSearch;
