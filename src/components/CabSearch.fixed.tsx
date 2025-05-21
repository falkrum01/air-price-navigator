import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, MapPin, Clock, Car, Navigation, ArrowRight, Calendar as CalendarIcon, Plane, Download } from 'lucide-react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { useBookingContext } from "@/contexts/BookingContext";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

// Define city coordinates and airports
const cityData = {
  "Hyderabad": { 
    center: { lat: 17.3850, lng: 78.4867 },
    airport: { 
      name: "Rajiv Gandhi International Airport", 
      code: "HYD",
      coordinates: { lat: 17.2403, lng: 78.4294 }
    }
  },
  "Delhi": { 
    center: { lat: 28.6139, lng: 77.2090 },
    airport: { 
      name: "Indira Gandhi International Airport", 
      code: "DEL",
      coordinates: { lat: 28.5562, lng: 77.1000 }
    }
  },
  "Mumbai": { 
    center: { lat: 19.0760, lng: 72.8777 },
    airport: { 
      name: "Chhatrapati Shivaji International Airport", 
      code: "BOM",
      coordinates: { lat: 19.0896, lng: 72.8656 }
    }
  },
  "Bangalore": { 
    center: { lat: 12.9716, lng: 77.5946 },
    airport: { 
      name: "Kempegowda International Airport", 
      code: "BLR",
      coordinates: { lat: 13.1989, lng: 77.7068 }
    }
  },
  "Chennai": { 
    center: { lat: 13.0827, lng: 80.2707 },
    airport: { 
      name: "Chennai International Airport", 
      code: "MAA",
      coordinates: { lat: 12.9941, lng: 80.1709 }
    }
  },
  "Kolkata": {
    center: { lat: 22.5726, lng: 88.3639 },
    airport: {
      name: "Netaji Subhas Chandra Bose International Airport",
      code: "CCU",
      coordinates: { lat: 22.6520, lng: 88.4463 }
    }
  },
  "Ahmedabad": {
    center: { lat: 23.0225, lng: 72.5714 },
    airport: {
      name: "Sardar Vallabhbhai Patel International Airport",
      code: "AMD",
      coordinates: { lat: 23.0741, lng: 72.6342 }
    }
  },
  "Pune": {
    center: { lat: 18.5204, lng: 73.8567 },
    airport: {
      name: "Pune International Airport",
      code: "PNQ",
      coordinates: { lat: 18.5824, lng: 73.9198 }
    }
  },
  "Jaipur": {
    center: { lat: 26.9124, lng: 75.7873 },
    airport: {
      name: "Jaipur International Airport",
      code: "JAI",
      coordinates: { lat: 26.8242, lng: 75.8122 }
    }
  },
  "Goa": {
    center: { lat: 15.2993, lng: 74.1240 },
    airport: {
      name: "Goa International Airport",
      code: "GOI",
      coordinates: { lat: 15.3808, lng: 73.8314 }
    }
  }
};

// Default city
const defaultCity = "Hyderabad";

// Cab types with base prices per km
const cabTypes = {
  "Economy": { basePrice: 15, icon: "🚗" },
  "Premium": { basePrice: 22, icon: "🚙" },
  "SUV": { basePrice: 30, icon: "🚐" }
};

// Interface for cab data
interface Cab {
  id: string;
  type: string;
  price: number;
  estimatedTime: string;
  distance: string;
  driverName: string;
  vehicleNumber: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: Date;
  coordinates: {
    pickup: { lat: number; lng: number };
    dropoff: { lat: number; lng: number };
  };
}

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px'
};

// Mock driver names for cabs
const driverNames = [
  'Rahul Kumar', 'Amit Singh', 'Priya Sharma', 'Vikram Patel', 'Sanjay Gupta', 
  'Neha Verma', 'Rajesh Khanna', 'Deepak Chauhan', 'Suresh Reddy', 'Anil Kapoor'
];

const CabSearch: React.FC = () => {
  // Get booking context to access hotel/hostel information
  const { booking, setCabBooking, hasAccommodationBooked } = useBookingContext();
  
  // State variables
  const [city, setCity] = useState(defaultCity);
  const [pickupLocation, setPickupLocation] = useState(cityData[defaultCity].airport.name);
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupTime, setPickupTime] = useState<Date>(new Date());
  const [selectedCabType, setSelectedCabType] = useState<string>("Economy");
  const [selectedCab, setSelectedCab] = useState<Cab | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableCabs, setAvailableCabs] = useState<Cab[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const { toast } = useToast();
  
  // Refs for Google Maps Places API
  const dropoffInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  // Load Google Maps with Places library
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyC6k680hSHNQB2QABFuwe4MyisofNSZIc4",
    libraries: ['places', 'geometry']
  });
  
  // Define helper functions first so they can be used in dependencies
  
  // Generate mock cabs when directions API fails
  const generateMockCabs = useCallback(() => {
    const cabs: Cab[] = Object.entries(cabTypes).map(([type, details], index) => {
      // Generate random distance (10-25 km)
      const distance = 10 + Math.random() * 15;
      
      // Calculate price based on distance and cab type
      const price = Math.round(distance * details.basePrice + Math.random() * 100);
      
      // Calculate time (2 min per km)
      const estimatedTime = Math.ceil(distance * 2);
      
      return {
        id: `cab-${type}-${index}`,
        type,
        price,
        estimatedTime: `${estimatedTime} min`,
        distance: `${distance.toFixed(1)} km`,
        driverName: driverNames[Math.floor(Math.random() * driverNames.length)],
        vehicleNumber: `KA ${10 + Math.floor(Math.random() * 90)} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${1000 + Math.floor(Math.random() * 9000)}`,
        pickupLocation,
        dropoffLocation,
        pickupTime,
        coordinates: {
          pickup: cityData[city].airport.coordinates,
          dropoff: cityData[city].center
        }
      };
    });
    
    setAvailableCabs(cabs);
    setLoading(false);
  }, [pickupLocation, dropoffLocation, pickupTime, city]);
  
  // Generate cab options based on directions result
  const generateCabOptions = useCallback((directionsResult: google.maps.DirectionsResult) => {
    const route = directionsResult.routes[0];
    const leg = route.legs[0];
    const distance = leg.distance?.value || 10000; // Distance in meters
    const duration = leg.duration?.value || 1200; // Duration in seconds
    
    const distanceInKm = distance / 1000;
    const durationInMinutes = Math.ceil(duration / 60);
    
    const cabs: Cab[] = Object.entries(cabTypes).map(([type, details], index) => {
      // Calculate price based on distance and cab type
      const price = Math.round(distanceInKm * details.basePrice + Math.random() * 100);
      
      // Adjust time based on cab type
      const timeMultiplier = type === "Economy" ? 1.1 : type === "Premium" ? 1.0 : 0.9;
      const estimatedTime = Math.ceil(durationInMinutes * timeMultiplier);
      
      return {
        id: `cab-${type}-${index}`,
        type,
        price,
        estimatedTime: `${estimatedTime} min`,
        distance: `${distanceInKm.toFixed(1)} km`,
        driverName: driverNames[Math.floor(Math.random() * driverNames.length)],
        vehicleNumber: `KA ${10 + Math.floor(Math.random() * 90)} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${1000 + Math.floor(Math.random() * 9000)}`,
        pickupLocation,
        dropoffLocation,
        pickupTime,
        coordinates: {
          pickup: cityData[city].airport.coordinates,
          dropoff: leg.end_location.toJSON()
        }
      };
    });
    
    setAvailableCabs(cabs);
    setLoading(false);
  }, [pickupLocation, dropoffLocation, pickupTime, city]);
  
  // Calculate directions between pickup and dropoff
  const calculateDirections = useCallback(() => {
    if (!window.google) return;
    
    const directionsService = new google.maps.DirectionsService();
    
    // Use airport coordinates as origin
    const origin = cityData[city].airport.coordinates;
    
    // Use Places API location if available, or city center as fallback
    let destination = cityData[city].center;
    
    // If autocomplete has a place, use its coordinates
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry && place.geometry.location) {
        destination = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
      }
    }
    
    directionsService.route(
      {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
          generateCabOptions(result);
        } else {
          toast({
            title: "Directions Error",
            description: "Could not calculate directions. Using mock data instead.",
            variant: "destructive"
          });
          // Generate mock cabs with estimated distance
          generateMockCabs();
        }
      }
    );
  }, [city, toast, generateCabOptions, generateMockCabs]);
  
  // Initialize Google Maps Places Autocomplete
  useEffect(() => {
    if (isLoaded && dropoffInputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        dropoffInputRef.current,
        { types: ['establishment', 'geocode'] }
      );
      
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.formatted_address) {
          setDropoffLocation((place.name ? place.name + ", " : "") + place.formatted_address);
        }
      });
    }
  }, [isLoaded]);
  
  // Detect city from accommodation location
  useEffect(() => {
    if (hasAccommodationBooked) {
      const accommodation = booking.hotel || booking.hostel;
      if (accommodation) {
        // Find city from accommodation location
        const cityName = Object.keys(cityData).find(c => 
          accommodation.location.toLowerCase().includes(c.toLowerCase())
        ) || defaultCity;
        
        setCity(cityName);
        setPickupLocation(cityData[cityName].airport.name);
        setDropoffLocation(accommodation.name + ", " + accommodation.location);
        
        // If flight is booked, set pickup time to arrival time
        if (booking.flight) {
          setPickupTime(new Date(booking.flight.arrivalTime));
        }
      }
    }
  }, [booking, hasAccommodationBooked]);
  
  // Calculate distance and directions when locations change
  useEffect(() => {
    if (isLoaded && pickupLocation && dropoffLocation) {
      calculateDirections();
    }
  }, [isLoaded, pickupLocation, dropoffLocation, city, calculateDirections]);
  
  // Handle cab selection
  const handleCabSelect = (cab: Cab) => {
    setSelectedCab(cab);
    
    // Save cab to booking context
    setCabBooking({
      id: cab.id,
      type: cab.type,
      price: cab.price,
      pickupLocation: cab.pickupLocation,
      dropoffLocation: cab.dropoffLocation,
      pickupTime: cab.pickupTime,
      driverName: cab.driverName,
      vehicleNumber: cab.vehicleNumber,
      distance: cab.distance,
      estimatedTime: cab.estimatedTime,
      coordinates: cab.coordinates
    });
    
    toast({
      title: "Cab Selected",
      description: `${cab.type} cab has been selected for ₹${cab.price}`,
    });
  };
  
  // Handle search for cabs
  const handleSearch = () => {
    if (!pickupLocation || !dropoffLocation) {
      toast({
        title: "Incomplete Information",
        description: "Please enter both pickup and dropoff locations",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    calculateDirections();
  };
  
  // Generate PDF with booking details
  const generatePDF = () => {
    if (!selectedCab) return;
    
    const doc = new jsPDF();
    
    // Add title and header
    doc.setFontSize(20);
    doc.text('Air Price Navigator - Booking Confirmation', 105, 20, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(20, 30, 190, 30);
    
    // Add cab details
    doc.setFontSize(16);
    doc.text('Transportation Details', 20, 40);
    doc.setFontSize(10);
    
    // @ts-expect-error jspdf-autotable types issue
    doc.autoTable({
      startY: 45,
      head: [['Detail', 'Information']],
      body: [
        ['Pickup', selectedCab.pickupLocation],
        ['Dropoff', selectedCab.dropoffLocation],
        ['Date & Time', format(selectedCab.pickupTime, 'PPP p')],
        ['Cab Type', selectedCab.type],
        ['Distance', selectedCab.distance],
        ['Estimated Time', selectedCab.estimatedTime],
        ['Driver', selectedCab.driverName],
        ['Vehicle Number', selectedCab.vehicleNumber],
        ['Price', `₹${selectedCab.price}`]
      ],
      theme: 'striped',
      headStyles: { fillColor: [66, 133, 244] }
    });
    
    // Add flight details if available
    if (booking.flight) {
      const flight = booking.flight;
      // @ts-expect-error jspdf-autotable types issue
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Flight Details', '']],
        body: [
          ['Flight', flight.flightNumber],
          ['Departure', format(new Date(flight.departureTime), 'PPP p')],
          ['Arrival', format(new Date(flight.arrivalTime), 'PPP p')],
          ['Price', `₹${flight.price}`]
        ],
        theme: 'striped',
        headStyles: { fillColor: [66, 133, 244] }
      });
    }
    
    // Add accommodation details if available
    if (hasAccommodationBooked) {
      const accommodation = booking.hotel || booking.hostel;
      if (accommodation) {
        // @ts-expect-error jspdf-autotable types issue
        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 10,
          head: [[accommodation === booking.hotel ? 'Hotel Details' : 'Hostel Details', '']],
          body: [
            ['Name', accommodation.name],
            ['Location', accommodation.location],
            ['Check-in', format(new Date(accommodation.checkIn), 'PPP')],
            ['Check-out', format(new Date(accommodation.checkOut), 'PPP')],
            ['Price', `₹${accommodation.totalPrice}`]
          ],
          theme: 'striped',
          headStyles: { fillColor: [66, 133, 244] }
        });
      }
    }
    
    // Add total price
    const totalPrice = (selectedCab.price || 0) + 
                      (booking.flight?.price || 0) + 
                      ((booking.hotel?.totalPrice || booking.hostel?.totalPrice) || 0);
    
    // @ts-expect-error jspdf-autotable types issue
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      body: [['Total Price', `₹${totalPrice}`]],
      theme: 'plain',
      styles: { fontSize: 12, fontStyle: 'bold' }
    });
    
    // Add footer
    doc.setFontSize(10);
    doc.text('Thank you for booking with Air Price Navigator!', 105, doc.internal.pageSize.height - 10, { align: 'center' });
    
    // Save PDF
    doc.save('booking-confirmation.pdf');
  };
  
  // Render loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ground Transport</CardTitle>
          <CardDescription>Book a cab from the airport to your accommodation</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-2">
              <label className="text-sm font-medium mb-1 block">Pickup Location</label>
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Enter pickup location" 
                  value={pickupLocation} 
                  onChange={(e) => setPickupLocation(e.target.value)}
                />
                <Button 
                  size="icon" 
                  variant="outline" 
                  title="Use airport" 
                  onClick={() => setPickupLocation(cityData[city].airport.name)}
                >
                  <Plane className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <label className="text-sm font-medium mb-1 block">Dropoff Location</label>
              <Input 
                placeholder="Enter dropoff location" 
                value={dropoffLocation} 
                onChange={(e) => setDropoffLocation(e.target.value)}
                ref={dropoffInputRef}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Pickup Date & Time</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {pickupTime ? format(pickupTime, 'PPP p') : <span>Pick a date & time</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={pickupTime}
                    onSelect={(date) => date && setPickupTime(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Cab Type</label>
              <select 
                className="w-full p-2 border rounded" 
                value={selectedCabType}
                onChange={(e) => setSelectedCabType(e.target.value)}
              >
                {Object.keys(cabTypes).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="lg:col-span-4">
              <Button onClick={handleSearch} className="w-full">
                <Car className="mr-2 h-4 w-4" /> Search for Cabs
              </Button>
            </div>
          </div>
          
          {/* Map View */}
          {directions && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Route Preview</h3>
              <div className="rounded-lg overflow-hidden">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={cityData[city].center}
                  zoom={10}
                  options={{ disableDefaultUI: false }}
                >
                  {/* Airport Marker */}
                  <Marker
                    position={cityData[city].airport.coordinates}
                    icon={{
                      url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                      scaledSize: new window.google.maps.Size(40, 40)
                    }}
                    title={cityData[city].airport.name}
                  />
                  
                  {/* Directions */}
                  {directions && (
                    <DirectionsRenderer
                      directions={directions}
                      options={{
                        polylineOptions: {
                          strokeColor: selectedCabType === "Economy" ? "#4CAF50" : 
                                      selectedCabType === "Premium" ? "#2196F3" : "#FF9800",
                          strokeWeight: 5
                        }
                      }}
                    />
                  )}
                </GoogleMap>
              </div>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <div className="flex items-center mr-4">
                  <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
                  <span>Airport</span>
                </div>
                <div className="flex items-center mr-4">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                  <span>Destination</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Available Cabs */}
          {loading ? (
            <div className="flex justify-center my-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            availableCabs.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Available Cabs</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {availableCabs.map(cab => (
                    <Card 
                      key={cab.id} 
                      className={cn(
                        "cursor-pointer transition-all",
                        selectedCab?.id === cab.id 
                          ? "border-blue-500 shadow-md" 
                          : "hover:border-blue-300"
                      )}
                      onClick={() => handleCabSelect(cab)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-lg font-semibold">{cab.type}</div>
                          <div className="text-lg font-bold">₹{cab.price}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Distance</p>
                            <p>{cab.distance}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Est. Time</p>
                            <p>{cab.estimatedTime}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          )}
          
          {/* Booking Summary */}
          {selectedCab && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pickup</p>
                  <p className="font-medium">{selectedCab.pickupLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Dropoff</p>
                  <p className="font-medium">{selectedCab.dropoffLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                  <p className="font-medium">{format(selectedCab.pickupTime, 'PPP p')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Cab Type</p>
                  <p className="font-medium">{selectedCab.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Distance</p>
                  <p className="font-medium">{selectedCab.distance}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Estimated Time</p>
                  <p className="font-medium">{selectedCab.estimatedTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Driver</p>
                  <p className="font-medium">{selectedCab.driverName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Vehicle Number</p>
                  <p className="font-medium">{selectedCab.vehicleNumber}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Price</p>
                  <p className="text-xl font-bold text-blue-600">₹{selectedCab.price}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1" onClick={() => {
                  toast({
                    title: "Booking Confirmed",
                    description: "Your cab has been booked successfully!"
                  });
                }}>
                  Confirm Booking
                </Button>
                <Button variant="outline" onClick={generatePDF} className="flex items-center gap-2">
                  <Download className="h-4 w-4" /> 
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CabSearch;
