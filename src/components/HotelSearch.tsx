
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin, Star, Check, Calendar, Users } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useBookingContext } from "@/contexts/BookingContext";
import { Hotel } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const HotelSearch: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
  );
  const [guests, setGuests] = useState<string>("2");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const { setHotelBooking, booking } = useBookingContext();
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
      const mockHotels: Hotel[] = [
        {
          id: "h1",
          name: "Grand Hyatt",
          location: location,
          checkIn: checkIn,
          checkOut: checkOut,
          roomType: "Deluxe Room",
          guestCount: parseInt(guests),
          pricePerNight: 12500,
          totalPrice: 12500 * calculateNights(checkIn, checkOut),
          amenities: ["Free WiFi", "Swimming Pool", "Fitness Center", "Restaurant"],
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          rating: 4.8,
          coordinates: {
            lat: 28.6139,
            lng: 77.2090,
          },
        },
        {
          id: "h2",
          name: "Taj Palace",
          location: location,
          checkIn: checkIn,
          checkOut: checkOut,
          roomType: "Premium Suite",
          guestCount: parseInt(guests),
          pricePerNight: 15000,
          totalPrice: 15000 * calculateNights(checkIn, checkOut),
          amenities: ["Free WiFi", "Swimming Pool", "Spa", "Restaurant", "Bar"],
          image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          rating: 4.9,
          coordinates: {
            lat: 28.6129,
            lng: 77.2295,
          },
        },
        {
          id: "h3",
          name: "The Leela Palace",
          location: location,
          checkIn: checkIn,
          checkOut: checkOut,
          roomType: "Executive Suite",
          guestCount: parseInt(guests),
          pricePerNight: 18000,
          totalPrice: 18000 * calculateNights(checkIn, checkOut),
          amenities: ["Free WiFi", "Swimming Pool", "Spa", "Restaurant", "Bar", "Butler Service"],
          image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          rating: 5.0,
          coordinates: {
            lat: 28.5925,
            lng: 77.1724,
          },
        },
        {
          id: "h4",
          name: "JW Marriott",
          location: location,
          checkIn: checkIn,
          checkOut: checkOut,
          roomType: "Deluxe King",
          guestCount: parseInt(guests),
          pricePerNight: 10000,
          totalPrice: 10000 * calculateNights(checkIn, checkOut),
          amenities: ["Free WiFi", "Gym", "Restaurant", "Room Service"],
          image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          rating: 4.5,
          coordinates: {
            lat: 28.5535,
            lng: 77.2588,
          },
        },
      ];
      
      setHotels(mockHotels);
      setLoading(false);
    }, 1500);
  };
  
  const calculateNights = (checkIn: Date, checkOut: Date): number => {
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setHotelBooking(hotel);
    toast({
      title: "Hotel selected",
      description: `${hotel.name} has been added to your booking.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <Input
            placeholder="Enter city or hotel name"
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
          <label className="block text-sm font-medium mb-1">Guests</label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger>
              <SelectValue placeholder="Number of guests" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Guest" : "Guests"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-grow">
          <label className="block text-sm font-medium mb-1">Max Price per Night (₹)</label>
          <div className="flex items-center gap-4">
            <Slider
              value={[maxPrice]}
              min={5000}
              max={30000}
              step={1000}
              onValueChange={([value]) => setMaxPrice(value)}
              className="flex-grow"
            />
            <span className="min-w-[80px] text-right">₹{maxPrice.toLocaleString()}</span>
          </div>
        </div>
        
        <Button 
          onClick={handleSearch}
          className="bg-airblue hover:bg-airblue/90 mt-4 md:mt-6"
        >
          Search Hotels
        </Button>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-airblue mb-4" />
          <p className="text-lg font-medium">Finding the best hotels for you...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {hotels.filter(hotel => hotel.pricePerNight <= maxPrice).map((hotel) => (
            <Card 
              key={hotel.id} 
              className={cn(
                "overflow-hidden transition-all",
                selectedHotel?.id === hotel.id ? "ring-2 ring-airblue" : ""
              )}
            >
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={hotel.image} 
                  alt={hotel.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{hotel.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{hotel.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-amber-100 px-2 py-1 rounded text-amber-700 font-semibold">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
                    {hotel.rating.toFixed(1)}
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {hotel.amenities.slice(0, 4).map((amenity, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center bg-gray-100 px-2 py-1 rounded text-xs"
                    >
                      <Check className="h-3 w-3 mr-1 text-green-600" />
                      {amenity}
                    </span>
                  ))}
                  {hotel.amenities.length > 4 && (
                    <span className="inline-flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
                      +{hotel.amenities.length - 4} more
                    </span>
                  )}
                </div>
                
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <div className="flex items-center mr-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{calculateNights(hotel.checkIn, hotel.checkOut)} nights</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{hotel.guestCount} guests</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-airblue">
                      ₹{hotel.pricePerNight.toLocaleString()}<span className="text-sm font-normal">/night</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ₹{hotel.totalPrice.toLocaleString()} total
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleSelect(hotel)}
                    variant={selectedHotel?.id === hotel.id ? "default" : "outline"}
                    className={selectedHotel?.id === hotel.id ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {selectedHotel?.id === hotel.id ? "Selected" : "Select"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {hotels.length > 0 && hotels.filter(hotel => hotel.pricePerNight <= maxPrice).length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-12 bg-muted rounded-lg">
              <p className="text-lg font-medium">No hotels match your price filter</p>
              <p className="text-muted-foreground">Try increasing your maximum price or changing your search criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelSearch;
