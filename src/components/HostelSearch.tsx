
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin, Star, Check, Calendar, Users, Wifi, Coffee, PlugZap } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useBookingContext } from "@/contexts/BookingContext";
import { Hostel } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const HostelSearch: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
  );
  const [guests, setGuests] = useState<string>("1");
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const { setHostelBooking, booking } = useBookingContext();
  const { toast } = useToast();

  // If flight is booked, use the destination as default location
  useEffect(() => {
    if (booking.flight) {
      setLocation(booking.flight.destination);
    }
  }, [booking.flight]);
  
  const handleSearch = () => {
    if (!location || !checkIn || !checkOut) {
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
      const mockHostels: Hostel[] = [
        {
          id: "hs1",
          name: "Backpackers Haven",
          location: location,
          checkIn: checkIn,
          checkOut: checkOut,
          bedType: "Mixed Dormitory (6-Bed)",
          guestCount: parseInt(guests),
          pricePerNight: 800,
          totalPrice: 800 * calculateNights(checkIn, checkOut),
          amenities: ["Free WiFi", "Common Kitchen", "Lockers", "24/7 Reception"],
          image: "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
          rating: 4.2,
          coordinates: {
            lat: 28.6429,
            lng: 77.2190,
          },
        },
        {
          id: "hs2",
          name: "Nomad's Nest",
          location: location,
          checkIn: checkIn,
          checkOut: checkOut,
          bedType: "Female Dormitory (4-Bed)",
          guestCount: parseInt(guests),
          pricePerNight: 950,
          totalPrice: 950 * calculateNights(checkIn, checkOut),
          amenities: ["Free WiFi", "Breakfast Included", "Lockers", "Rooftop Lounge"],
          image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
          rating: 4.5,
          coordinates: {
            lat: 28.6329,
            lng: 77.2195,
          },
        },
        {
          id: "hs3",
          name: "Wanderer's Place",
          location: location,
          checkIn: checkIn,
          checkOut: checkOut,
          bedType: "Private Room (2-Bed)",
          guestCount: parseInt(guests),
          pricePerNight: 1500,
          totalPrice: 1500 * calculateNights(checkIn, checkOut),
          amenities: ["Free WiFi", "Private Bathroom", "Breakfast Available", "Air Conditioning"],
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          rating: 4.7,
          coordinates: {
            lat: 28.6229,
            lng: 77.2175,
          },
        },
        {
          id: "hs4",
          name: "Budget Bunks",
          location: location,
          checkIn: checkIn,
          checkOut: checkOut,
          bedType: "Mixed Dormitory (8-Bed)",
          guestCount: parseInt(guests),
          pricePerNight: 600,
          totalPrice: 600 * calculateNights(checkIn, checkOut),
          amenities: ["Free WiFi", "Common Area", "Luggage Storage", "Shared Kitchen"],
          image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
          rating: 3.8,
          coordinates: {
            lat: 28.6529,
            lng: 77.2290,
          },
        },
      ];
      
      setHostels(mockHostels);
      setLoading(false);
    }, 1500);
  };
  
  const calculateNights = (checkIn: Date, checkOut: Date): number => {
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleSelect = (hostel: Hostel) => {
    setSelectedHostel(hostel);
    setHostelBooking(hostel);
    toast({
      title: "Hostel selected",
      description: `${hostel.name} has been added to your booking.`,
    });
  };
  
  const getAmenityIcon = (amenity: string) => {
    if (amenity.includes("WiFi")) return <Wifi className="h-3 w-3" />;
    if (amenity.includes("Breakfast")) return <Coffee className="h-3 w-3" />;
    if (amenity.includes("Power")) return <PlugZap className="h-3 w-3" />;
    return <Check className="h-3 w-3" />;
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <Input
            placeholder="Enter city or hostel name"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Check-in</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkIn && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {checkIn ? format(checkIn, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Check-out</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkOut && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {checkOut ? format(checkOut, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                initialFocus
                disabled={(date) => !checkIn || date <= checkIn}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Travelers</label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger>
              <SelectValue placeholder="Number of travelers" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Traveler" : "Travelers"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        onClick={handleSearch}
        className="bg-airblue hover:bg-airblue/90"
      >
        Search Hostels
      </Button>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-airblue mb-4" />
          <p className="text-lg font-medium">Finding the best hostels for you...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {hostels.map((hostel) => (
            <Card 
              key={hostel.id} 
              className={cn(
                "overflow-hidden transition-all",
                selectedHostel?.id === hostel.id ? "ring-2 ring-airblue" : ""
              )}
            >
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={hostel.image} 
                  alt={hostel.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{hostel.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{hostel.location}</span>
                    </div>
                    <Badge variant="outline" className="mt-1">
                      {hostel.bedType}
                    </Badge>
                  </div>
                  <div className="flex items-center bg-amber-100 px-2 py-1 rounded text-amber-700 font-semibold">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
                    {hostel.rating.toFixed(1)}
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {hostel.amenities.map((amenity, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center bg-gray-100 px-2 py-1 rounded text-xs"
                    >
                      {getAmenityIcon(amenity)}
                      <span className="ml-1">{amenity}</span>
                    </span>
                  ))}
                </div>
                
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <div className="flex items-center mr-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{calculateNights(hostel.checkIn, hostel.checkOut)} nights</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{hostel.guestCount} {hostel.guestCount === 1 ? 'traveler' : 'travelers'}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-airblue">
                      ₹{hostel.pricePerNight.toLocaleString()}<span className="text-sm font-normal">/night</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ₹{hostel.totalPrice.toLocaleString()} total
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleSelect(hostel)}
                    variant={selectedHostel?.id === hostel.id ? "default" : "outline"}
                    className={selectedHostel?.id === hostel.id ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {selectedHostel?.id === hostel.id ? "Selected" : "Select"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HostelSearch;
