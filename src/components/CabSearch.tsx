
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin, Clock, ArrowRight, Navigation, Car, Locate } from "lucide-react";
import { useBookingContext } from "@/contexts/BookingContext";
import { Cab } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { indianAirports } from "@/data/indianAirports";

// Mock mapbox function since we're not actually loading the library
const initializeMap = (container: HTMLDivElement, location: string, cabLocations: any[]) => {
  // In a real implementation, this would initialize an actual map
  container.innerHTML = `
    <div class="relative h-full bg-blue-50">
      <div class="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=14&size=800x500&maptype=roadmap&key=NO_API_KEY_NEEDED_FOR_MOCK')] bg-cover bg-center opacity-70"></div>
      
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
          <p class="font-medium">Interactive Map Placeholder</p>
          <p class="text-sm text-gray-500">In a real app, this would show real-time cab locations</p>
        </div>
      </div>
      
      <!-- Pickup Location Marker -->
      <div class="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2" style="left: 50%; top: 50%;">
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a7 7 0 0 0-7 7c0 2 1 3.5 2.5 5s2.5 2.5 4.5 4.5 2 2 2 2a1 1 0 0 0 1.4 0s.5-.5 2-2 3-3 4.5-4.5S20 11 20 9a7 7 0 0 0-7-7Z"/>
            <path d="M12 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
          </svg>
        </div>
        <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs font-medium">
          You are here
        </div>
      </div>
    </div>
  `;
  
  // Add mock cab locations
  cabLocations.forEach((cab, index) => {
    const cabMarker = document.createElement('div');
    cabMarker.className = 'absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2';
    cabMarker.style.left = `${20 + (index * 15)}%`;
    cabMarker.style.top = `${30 + (index * 10)}%`;
    
    cabMarker.innerHTML = `
      <div class="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.3-.9-2.1-.9H5c-.8 0-1.5.5-1.8 1.3L2 13"/>
          <path d="M19 17H5"/>
          <path d="M15 17v3H9v-3"/>
          <path d="M5 11v6"/>
          <path d="M19 11v6"/>
          <circle cx="7.5" cy="15.5" r="1.5"/>
          <circle cx="16.5" cy="15.5" r="1.5"/>
        </svg>
      </div>
    `;
    
    const mapContainer = container.querySelector('div');
    if (mapContainer) {
      mapContainer.appendChild(cabMarker);
    }
  });
};

const CabSearch: React.FC = () => {
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [dropoffLocation, setDropoffLocation] = useState<string>("");
  const [pickupTime, setPickupTime] = useState<Date | undefined>(
    new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
  );
  const [cabType, setCabType] = useState<string>("sedan");
  const [cabs, setCabs] = useState<Cab[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCab, setSelectedCab] = useState<Cab | null>(null);
  const [mockCabLocations, setMockCabLocations] = useState<any[]>([]);
  const { setCabBooking, booking } = useBookingContext();
  const { toast } = useToast();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-fill pickup and dropoff locations based on flight and accommodation
  useEffect(() => {
    if (booking.flight) {
      // Get destination city name from airport code
      const destinationAirport = indianAirports.find(
        airport => airport.code === booking.flight?.destination
      );
      
      const destinationName = destinationAirport ? 
        `${destinationAirport.name}, ${destinationAirport.city}` : 
        `${booking.flight.destination} Airport`;
      
      // If hotel/hostel is booked, set it as dropoff location and airport as pickup
      if (booking.hotel) {
        setPickupLocation(destinationName);
        setDropoffLocation(booking.hotel.name);
      } else if (booking.hostel) {
        setPickupLocation(destinationName);
        setDropoffLocation(booking.hostel.name);
      } else {
        // If no accommodation booked yet, just set airport as pickup
        setPickupLocation(destinationName);
      }
      
      // Set pickup time to one hour after flight arrival if available
      if (booking.flight.arrivalTime) {
        const arrivalTime = new Date(booking.flight.arrivalTime);
        arrivalTime.setHours(arrivalTime.getHours() + 1); // Add 1 hour for luggage collection
        setPickupTime(arrivalTime);
      }
    }
  }, [booking.flight, booking.hotel, booking.hostel]);
  
  // Generate mock data for cab locations when component mounts
  useEffect(() => {
    // Create 5-8 random cab locations for the map
    const randomCount = Math.floor(Math.random() * 4) + 5;
    const locations = [];
    
    for (let i = 0; i < randomCount; i++) {
      locations.push({
        id: `cab-${i}`,
        type: ['Sedan', 'SUV', 'Premium', 'Economy'][Math.floor(Math.random() * 4)],
        distance: `${Math.floor(Math.random() * 10) + 1} km away`
      });
    }
    
    setMockCabLocations(locations);
  }, []);
  
  // Initialize the map when container is available and pickup location changes
  useEffect(() => {
    if (mapContainerRef.current && pickupLocation) {
      initializeMap(mapContainerRef.current, pickupLocation, mockCabLocations);
    }
  }, [pickupLocation, mockCabLocations]);
  
  const handleSearch = () => {
    if (!pickupLocation || !dropoffLocation || !pickupTime) {
      toast({
        title: "Incomplete search",
        description: "Please fill in all search fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Mock API call - in a real app, this would be an API request
    setTimeout(() => {
      const mockCabs: Cab[] = [
        {
          id: "c1",
          type: "Economy",
          pickupLocation: pickupLocation,
          dropoffLocation: dropoffLocation,
          pickupTime: pickupTime,
          price: 800,
          estimatedTime: "30 min",
          distance: "15 km",
          coordinates: {
            pickup: {
              lat: 28.6139,
              lng: 77.2090,
            },
            dropoff: {
              lat: 28.5562,
              lng: 77.1000,
            },
          },
        },
        {
          id: "c2",
          type: "Sedan",
          pickupLocation: pickupLocation,
          dropoffLocation: dropoffLocation,
          pickupTime: pickupTime,
          price: 1200,
          estimatedTime: "35 min",
          distance: "15 km",
          driverName: "Rajesh Kumar",
          vehicleNumber: "DL 01 AB 1234",
          coordinates: {
            pickup: {
              lat: 28.6139,
              lng: 77.2090,
            },
            dropoff: {
              lat: 28.5562,
              lng: 77.1000,
            },
          },
        },
        {
          id: "c3",
          type: "SUV",
          pickupLocation: pickupLocation,
          dropoffLocation: dropoffLocation,
          pickupTime: pickupTime,
          price: 1800,
          estimatedTime: "35 min",
          distance: "15 km",
          driverName: "Amit Singh",
          vehicleNumber: "DL 02 CD 5678",
          coordinates: {
            pickup: {
              lat: 28.6139,
              lng: 77.2090,
            },
            dropoff: {
              lat: 28.5562,
              lng: 77.1000,
            },
          },
        },
        {
          id: "c4",
          type: "Premium",
          pickupLocation: pickupLocation,
          dropoffLocation: dropoffLocation,
          pickupTime: pickupTime,
          price: 2500,
          estimatedTime: "30 min",
          distance: "15 km",
          driverName: "Vikram Mehta",
          vehicleNumber: "DL 03 EF 9012",
          coordinates: {
            pickup: {
              lat: 28.6139,
              lng: 77.2090,
            },
            dropoff: {
              lat: 28.5562,
              lng: 77.1000,
            },
          },
        },
      ];
      
      setCabs(mockCabs);
      setLoading(false);
    }, 1500);
  };

  const handleSelect = (cab: Cab) => {
    setSelectedCab(cab);
    setCabBooking(cab);
    toast({
      title: "Cab selected",
      description: `${cab.type} cab has been added to your booking.`,
    });
  };

  const getCabImage = (type: string) => {
    switch (type.toLowerCase()) {
      case 'economy':
        return "https://cdn-icons-png.flaticon.com/512/3097/3097137.png";
      case 'sedan':
        return "https://cdn-icons-png.flaticon.com/512/3097/3097118.png";
      case 'suv':
        return "https://cdn-icons-png.flaticon.com/512/3097/3097094.png";
      case 'premium':
        return "https://cdn-icons-png.flaticon.com/512/3097/3097090.png";
      default:
        return "https://cdn-icons-png.flaticon.com/512/3097/3097118.png";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pickup Location</label>
              <Input
                placeholder="Enter pickup address"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Dropoff Location</label>
              <Input
                placeholder="Enter dropoff address"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Pickup Time</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !pickupTime && "text-muted-foreground"
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {pickupTime ? format(pickupTime, "PPP p") : <span>Choose time</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="start">
                  <div className="space-y-4">
                    <Input
                      type="datetime-local"
                      value={pickupTime ? new Date(pickupTime.getTime() - pickupTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          setPickupTime(new Date(e.target.value));
                        }
                      }}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Cab Type</label>
              <Select value={cabType} onValueChange={setCabType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cab type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleSearch}
              className="w-full bg-airblue hover:bg-airblue/90"
            >
              Search Cabs
            </Button>
          </div>

          {/* Live Cab Availability Indicator */}
          {pickupLocation && mockCabLocations.length > 0 && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Locate className="h-4 w-4 mr-2 text-green-600" />
                  Available Cabs Nearby
                </h4>
                <div className="space-y-2">
                  {mockCabLocations.slice(0, 4).map((cab, idx) => (
                    <div key={cab.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Car className="h-3 w-3 mr-2 text-gray-600" />
                        <span>{cab.type}</span>
                      </div>
                      <span className="text-gray-600">{cab.distance}</span>
                    </div>
                  ))}
                  {mockCabLocations.length > 4 && (
                    <div className="text-xs text-center text-gray-500 italic pt-1">
                      +{mockCabLocations.length - 4} more cabs available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-2">
          <div className="h-96 rounded-lg overflow-hidden border relative" ref={mapContainerRef}>
            {!pickupLocation && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center p-6">
                  <Navigation className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                  <p className="text-lg font-medium">No Location Selected</p>
                  <p className="text-sm text-muted-foreground mt-1">Enter a pickup location to see available cabs</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Available Cabs</h3>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-airblue mb-4" />
                <p className="text-lg font-medium">Finding the best cabs for you...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cabs.map((cab) => (
                  <Card 
                    key={cab.id} 
                    className={cn(
                      "overflow-hidden transition-all",
                      selectedCab?.id === cab.id ? "ring-2 ring-airblue" : ""
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img 
                            src={getCabImage(cab.type)} 
                            alt={cab.type} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold">{cab.type}</h4>
                            <span className="text-lg font-bold text-airblue">
                              ₹{cab.price.toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{cab.estimatedTime}</span>
                            </div>
                            <div className="mx-2">•</div>
                            <span>{cab.distance}</span>
                            {cab.driverName && (
                              <>
                                <div className="mx-2">•</div>
                                <span>{cab.driverName}</span>
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-1 mt-2">
                            <div className="text-sm inline-flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate max-w-[140px]">{cab.pickupLocation}</span>
                            </div>
                            <ArrowRight className="h-3 w-3 mx-1" />
                            <div className="text-sm inline-flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate max-w-[140px]">{cab.dropoffLocation}</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Button 
                            onClick={() => handleSelect(cab)}
                            variant={selectedCab?.id === cab.id ? "default" : "outline"}
                            className={selectedCab?.id === cab.id ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {selectedCab?.id === cab.id ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {cabs.length === 0 && !loading && (
                  <div className="text-center py-8 bg-muted rounded-lg">
                    <p className="text-lg font-medium">No cabs found</p>
                    <p className="text-muted-foreground">Search for available cabs by entering your details</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabSearch;
