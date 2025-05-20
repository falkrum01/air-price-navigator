
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin, Clock, ArrowRight } from "lucide-react";
import { useBookingContext } from "@/contexts/BookingContext";
import { Cab } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock mapbox function since we're not actually loading the library
const initializeMap = (container: HTMLDivElement, pickupCoords: [number, number], dropoffCoords?: [number, number]) => {
  // In a real implementation, this would initialize an actual map
  // For now, we'll just add a placeholder image to show where the map would be
  container.innerHTML = `
    <div class="flex items-center justify-center h-full bg-gray-100 rounded">
      <div class="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p class="text-gray-500">Interactive Map</p>
        <p class="text-sm text-gray-400">(Placeholder - would show real map in production)</p>
      </div>
    </div>
  `;
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
  const { setCabBooking, booking } = useBookingContext();
  const { toast } = useToast();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // If flight is booked, use the destination as default dropoff location
  useEffect(() => {
    if (booking.flight) {
      // Use flight destination for dropoff
      setDropoffLocation(`${booking.flight.destination} Airport`);
      
      // If hotel/hostel is booked, use it for pickup
      if (booking.hotel) {
        setPickupLocation(booking.hotel.name);
      } else if (booking.hostel) {
        setPickupLocation(booking.hostel.name);
      }
    }
  }, [booking.flight, booking.hotel, booking.hostel]);
  
  // Initialize the map when container is available
  useEffect(() => {
    if (mapContainerRef.current) {
      initializeMap(mapContainerRef.current, [28.6139, 77.2090]);
    }
  }, []);
  
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
        </div>
        
        <div className="lg:col-span-2">
          <div className="h-96 rounded-lg overflow-hidden border" ref={mapContainerRef}>
            {/* Map will be rendered here */}
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
