
import React, { useState, useEffect } from "react";
import FlightCard from "./FlightCard";
import AirlineFilter from "./AirlineFilter";
import BookingModal from "./BookingModal";
import { Flight } from "@/types/flight";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, FilterX, IndianRupee, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface PriceComparisonProps {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: string;
}

const PriceComparison: React.FC<PriceComparisonProps> = ({
  origin,
  destination,
  departureDate,
  returnDate,
  passengers,
  cabinClass,
}) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortOption, setSortOption] = useState<string>("price-asc");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedFlightDetails, setSelectedFlightDetails] = useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch flights data
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        
        // Simulate API call with a timeout
        setTimeout(() => {
          // Mock data - in a real app, this would be an API call
          const mockFlights: Flight[] = [
            {
              id: "AI101",
              airline: "Air India",
              airlineLogo: "https://seeklogo.com/images/A/air-india-logo-6C288EE1B0-seeklogo.com.png",
              origin: origin,
              destination: destination,
              departureDate: departureDate,
              departureTime: "06:15",
              arrivalTime: "08:45",
              duration: "2h 30m",
              stops: 0,
              price: 5200,
              website: "MakeMyTrip",
              websiteLogo: "https://imgak.mmtcdn.com/pwa_v3/pwa_commons_assets/desktop/png/MMT-Logo.png",
            },
            {
              id: "SG405",
              airline: "SpiceJet",
              airlineLogo: "https://seeklogo.com/images/S/spicejet-logo-768009B71F-seeklogo.com.png",
              origin: origin,
              destination: destination,
              departureDate: departureDate,
              departureTime: "10:30",
              arrivalTime: "13:15",
              duration: "2h 45m",
              stops: 1,
              price: 4800,
              website: "Paytm",
              websiteLogo: "https://seeklogo.com/images/P/paytm-logo-0124A6D783-seeklogo.com.png",
            },
            {
              id: "UK969",
              airline: "Vistara",
              airlineLogo: "https://seeklogo.com/images/V/vistara-logo-91C2A3242D-seeklogo.com.png",
              origin: origin,
              destination: destination,
              departureDate: departureDate,
              departureTime: "12:45",
              arrivalTime: "15:00",
              duration: "2h 15m",
              stops: 0,
              price: 6100,
              website: "Cleartrip",
              websiteLogo: "https://seeklogo.com/images/C/cleartrip-logo-3A4DD1ED23-seeklogo.com.png",
            },
            {
              id: "6E235",
              airline: "IndiGo",
              airlineLogo: "https://seeklogo.com/images/I/indigo-airlines-logo-DBEBF52533-seeklogo.com.png",
              origin: origin,
              destination: destination,
              departureDate: departureDate,
              departureTime: "16:20",
              arrivalTime: "18:55",
              duration: "2h 35m",
              stops: 0,
              price: 5500,
              website: "Goibibo",
              websiteLogo: "https://seeklogo.com/images/G/goibibo-logo-89AAA42136-seeklogo.com.png",
            },
            {
              id: "G8456",
              airline: "GoAir",
              airlineLogo: "https://seeklogo.com/images/G/go-air-logo-4E7AE3C53B-seeklogo.com.png",
              origin: origin,
              destination: destination,
              departureDate: departureDate,
              departureTime: "19:10",
              arrivalTime: "21:30",
              duration: "2h 20m",
              stops: 0,
              price: 4500,
              website: "Ixigo",
              websiteLogo: "https://seeklogo.com/images/I/ixigo-logo-BCA9C8F774-seeklogo.com.png",
            },
          ];
          
          setFlights(mockFlights);
          setFilteredFlights(mockFlights);
          
          // Create list of all airlines
          const airlines = [...new Set(mockFlights.map((flight) => flight.airline))];
          setSelectedAirlines(airlines);
          
          // Find price range
          const prices = mockFlights.map((flight) => flight.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange([minPrice, maxPrice]);
          
          setLoading(false);
        }, 1500);
      } catch (err) {
        setError("Failed to load flight data. Please try again.");
        setLoading(false);
        console.error("Error fetching flights:", err);
      }
    };

    if (!user) {
      // If user is not logged in, redirect to auth
      toast({
        title: "Login Required",
        description: "Please log in to search for flights",
        variant: "default",
      });
      navigate('/auth');
    } else {
      fetchFlights();
    }
  }, [origin, destination, departureDate, user, navigate]);

  // Apply filters
  useEffect(() => {
    if (flights.length === 0) return;

    // Filter by selected airlines and price range
    const filtered = flights.filter(
      (flight) =>
        selectedAirlines.includes(flight.airline) &&
        flight.price >= priceRange[0] &&
        flight.price <= priceRange[1]
    );

    // Sort flights based on the selected sort option
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "duration-asc":
          return a.duration.localeCompare(b.duration);
        case "departure-asc":
          return a.departureTime.localeCompare(b.departureTime);
        case "arrival-asc":
          return a.arrivalTime.localeCompare(b.arrivalTime);
        default:
          return 0;
      }
    });

    setFilteredFlights(sorted);
  }, [flights, selectedAirlines, priceRange, sortOption]);

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const resetFilters = () => {
    setSelectedAirlines([...new Set(flights.map((flight) => flight.airline))]);
    const prices = flights.map((flight) => flight.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    setPriceRange([minPrice, maxPrice]);
    setSortOption("price-asc");
  };

  const handleBookingClick = (flightDetails: any) => {
    // Prepare booking details with additional information
    const bookingDetails = {
      ...flightDetails,
      passengers: parseInt(passengers.toString()),
      cabinClass,
      returnDate
    };
    
    setSelectedFlightDetails(bookingDetails);
    setIsBookingModalOpen(true);
  };

  // Extract unique airlines for filtering
  const uniqueAirlines = [...new Set(flights.map((flight) => flight.airline))];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-airblue mb-4" />
        <h3 className="text-xl font-medium">Loading flight options</h3>
        <p className="text-muted-foreground">Please wait while we find the best deals for you</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-[400px]">
        <p className="text-red-500 mb-4">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Filters Panel */}
      <div className="col-span-1">
        <Card className="sticky top-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Filters</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={resetFilters}
            >
              <FilterX className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Airlines filter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Airlines</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                          <HelpCircle className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-48">Select the airlines you want to include in the search results.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <AirlineFilter 
                  availableAirlines={uniqueAirlines}
                  selectedAirlines={selectedAirlines} 
                  onSelectionChange={setSelectedAirlines} 
                />
              </div>

              {/* Price range filter */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Price Range</h3>
                  <span className="text-sm text-muted-foreground">
                    ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}
                  </span>
                </div>

                <Slider
                  min={Math.min(...flights.map((f) => f.price))}
                  max={Math.max(...flights.map((f) => f.price))}
                  step={100}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={(value) => setPriceRange([value[0], value[1]])}
                  className="mb-6"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="min-price" className="text-xs text-muted-foreground mb-1 block">
                      Min Price
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="min-price"
                        type="number"
                        className="pl-8"
                        value={priceRange[0]}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 0 && value <= priceRange[1]) {
                            setPriceRange([value, priceRange[1]]);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="max-price" className="text-xs text-muted-foreground mb-1 block">
                      Max Price
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="max-price"
                        type="number"
                        className="pl-8"
                        value={priceRange[1]}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= priceRange[0]) {
                            setPriceRange([priceRange[0], value]);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sort options */}
              <div>
                <label htmlFor="sort-option" className="text-sm font-medium block mb-2">
                  Sort By
                </label>
                <Select 
                  value={sortOption} 
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger id="sort-option">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="duration-asc">Duration: Shortest</SelectItem>
                    <SelectItem value="departure-asc">Departure: Earliest</SelectItem>
                    <SelectItem value="arrival-asc">Arrival: Earliest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Panel */}
      <div className="col-span-1 md:col-span-3">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">
              {filteredFlights.length} {filteredFlights.length === 1 ? 'flight' : 'flights'} found
            </h2>
          </div>

          {filteredFlights.length > 0 ? (
            filteredFlights.map((flight) => (
              <FlightCard 
                key={flight.id} 
                flight={flight}
                onBook={handleBookingClick}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <h3 className="text-lg font-medium">No flights match your filters</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters to see more results</p>
              <Button onClick={resetFilters} variant="outline" className="mt-4">
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedFlightDetails && (
        <BookingModal 
          isOpen={isBookingModalOpen} 
          onClose={() => setIsBookingModalOpen(false)} 
          flightDetails={selectedFlightDetails}
        />
      )}
    </div>
  );
};

export default PriceComparison;
