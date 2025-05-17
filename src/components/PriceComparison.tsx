
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchParams } from "@/types/flight";
import { supabase } from "@/integrations/supabase/client";
import FlightCard from "./FlightCard";
import AirlineFilter from "./AirlineFilter";
import { Loader2 } from "lucide-react";
import BookingButton from "./BookingButton";
import BookingModal from "./BookingModal";

interface PriceComparisonProps {
  searchParams: SearchParams;
  loading: boolean;
}

// Mock data for flight prices from different OTAs
const mockOtaData = [
  { name: 'MakeMyTrip', price: 6249, image: 'https://seeklogo.com/images/M/MakeMyTrip-logo-25095AA180-seeklogo.com.png' },
  { name: 'Cleartrip', price: 6299, image: 'https://media.glassdoor.com/sqll/300494/cleartrip-com-squarelogo-1583902147100.png' },
  { name: 'Goibibo', price: 6349, image: 'https://static.goibibo.com/dist/images/favicon-192-192.png' },
  { name: 'Yatra', price: 6399, image: 'https://play-lh.googleusercontent.com/XbDBXrWJ7Ta5WIWbXEjjcsld5jLutrKw_pYHwoN6jS1BdAAR5nLTUpUIGhY5qh22C7U=w480-h960' },
  { name: 'EaseMyTrip', price: 6449, image: 'https://play-lh.googleusercontent.com/R1KLExWYrJlN5RRhPXwvMusgW3YCPJ2CanpVlGXUTbJqJBjk3XMgxZd3DBl79XKY_IE=w480-h960' }
];

interface Flight {
  id: string;
  airline: string;
  class: string;
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string | null;
  price: number;
  currency: string;
}

const PriceComparison: React.FC<PriceComparisonProps> = ({ searchParams, loading: initialLoading }) => {
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [priceSort, setPriceSort] = useState<'asc' | 'desc'>('asc');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const { data: flights, isLoading, error } = useQuery({
    queryKey: ['flights', searchParams],
    queryFn: async () => {
      try {
        let query = supabase
          .from('flight_data')
          .select('*')
          .eq('origin', searchParams.origin)
          .eq('destination', searchParams.destination)
          .eq('class', searchParams.cabinClass)

        if (searchParams.departureDate) {
          query = query.eq('departure_date', searchParams.departureDate)
        }

        if (searchParams.returnDate) {
          query = query.eq('return_date', searchParams.returnDate)
        } else {
          query = query.is('return_date', null)
        }

        const { data, error } = await query;
        
        if (error) {
          throw new Error(error.message);
        }

        // If no data in Supabase, use mock data
        if (!data || data.length === 0) {
          return generateMockFlights(searchParams);
        }

        return data;
      } catch (error) {
        console.error('Error fetching flight data:', error);
        return generateMockFlights(searchParams);
      }
    },
    enabled: !!searchParams.origin && !!searchParams.destination && !!searchParams.departureDate
  });

  // Generate mock flight data
  const generateMockFlights = (params: SearchParams): Flight[] => {
    const airlines = ['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia India'];
    const basePrice = Math.floor(Math.random() * 3000) + 4000;
    
    return airlines.map((airline, index) => ({
      id: `mock-${index}`,
      airline,
      class: params.cabinClass,
      origin: params.origin,
      destination: params.destination,
      departure_date: params.departureDate,
      return_date: params.returnDate || null,
      price: basePrice + (index * 200) + (Math.floor(Math.random() * 200)),
      currency: 'INR'
    }));
  };

  const loading = initialLoading || isLoading;

  const filteredFlights = flights?.filter(flight => 
    selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline)
  ) || [];

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    return priceSort === 'asc' ? a.price - b.price : b.price - a.price;
  });
  
  const availableAirlines = flights?.reduce((acc: string[], flight) => {
    if (!acc.includes(flight.airline)) {
      acc.push(flight.airline);
    }
    return acc;
  }, []) || [];

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsBookingModalOpen(true);
  };

  // Mock departure and arrival times
  const generateMockTimes = () => {
    const hours = ["06", "08", "10", "13", "15", "18", "20", "22"];
    const minutes = ["00", "15", "30", "45"];
    
    const departureHour = hours[Math.floor(Math.random() * hours.length)];
    const departureMinute = minutes[Math.floor(Math.random() * minutes.length)];
    
    const durationHours = Math.floor(Math.random() * 3) + 1;
    const durationMinutes = Math.floor(Math.random() * 60);
    
    const departureTime = `${departureHour}:${departureMinute}`;
    
    // Calculate arrival time
    let arrivalHour = parseInt(departureHour) + durationHours;
    let arrivalMinute = parseInt(departureMinute) + durationMinutes;
    
    if (arrivalMinute >= 60) {
      arrivalHour += 1;
      arrivalMinute -= 60;
    }
    
    if (arrivalHour >= 24) {
      arrivalHour -= 24;
    }
    
    const arrivalTime = `${String(arrivalHour).padStart(2, '0')}:${String(arrivalMinute).padStart(2, '0')}`;
    const duration = `${durationHours}h ${durationMinutes}m`;
    
    return { departureTime, arrivalTime, duration };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flight Prices</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-airblue" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>Error loading flight data. Please try again.</p>
          </div>
        ) : flights && flights.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 font-medium">Sort By Price</h3>
                  <RadioGroup 
                    defaultValue="asc" 
                    value={priceSort} 
                    onValueChange={(value) => setPriceSort(value as 'asc' | 'desc')}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="asc" id="price-asc" />
                      <Label htmlFor="price-asc">Lowest to Highest</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="desc" id="price-desc" />
                      <Label htmlFor="price-desc">Highest to Lowest</Label>
                    </div>
                  </RadioGroup>
                </div>

                <AirlineFilter 
                  airlines={availableAirlines}
                  selectedAirlines={selectedAirlines}
                  onSelectionChange={setSelectedAirlines}
                />
              </div>
              
              <div className="space-y-4">
                <Tabs defaultValue="flights">
                  <TabsList className="mb-4">
                    <TabsTrigger value="flights">Flights</TabsTrigger>
                    <TabsTrigger value="comparison">Price Comparison</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="flights" className="space-y-4">
                    {sortedFlights.length === 0 ? (
                      <div className="text-center py-8">
                        <p>No flights found matching your criteria.</p>
                      </div>
                    ) : (
                      sortedFlights.map((flight) => {
                        // Generate mock flight details
                        const flightNumber = `${flight.airline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000) + 1000}`;
                        const { departureTime, arrivalTime, duration } = generateMockTimes();

                        return (
                          <FlightCard
                            key={flight.id}
                            airline={flight.airline}
                            flightNumber={flightNumber}
                            origin={flight.origin}
                            destination={flight.destination}
                            departureTime={departureTime}
                            arrivalTime={arrivalTime}
                            duration={duration}
                            price={flight.price}
                            action={
                              <BookingButton 
                                price={flight.price} 
                                onClick={() => handleSelectFlight(flight)} 
                              />
                            }
                          />
                        );
                      })
                    )}
                  </TabsContent>
                  
                  <TabsContent value="comparison">
                    <div className="bg-muted p-4 rounded-lg mb-4">
                      <h3 className="font-medium mb-2">Compare with Online Travel Agencies</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        See how our prices compare with major Indian OTAs for the best deal
                      </p>
                      
                      {sortedFlights.length > 0 && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                              <div className="bg-airblue rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                                1
                              </div>
                              <span className="font-medium">SkyPredict</span>
                            </div>
                            <div className="text-right font-bold">
                              ₹{sortedFlights[0].price.toLocaleString('en-IN')}
                            </div>
                          </div>
                          
                          {mockOtaData.map((ota, index) => (
                            <div key={ota.name} className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-2">
                                <div className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-gray-700 text-xs font-bold">
                                  {index + 2}
                                </div>
                                <span>{ota.name}</span>
                              </div>
                              <div className="text-right">
                                ₹{ota.price.toLocaleString('en-IN')}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p>No flight data available. Please search for flights.</p>
          </div>
        )}
      </CardContent>
      
      {selectedFlight && (
        <BookingModal 
          isOpen={isBookingModalOpen} 
          onClose={() => setIsBookingModalOpen(false)} 
          flightDetails={{
            airline: selectedFlight.airline,
            flightNumber: `${selectedFlight.airline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000) + 1000}`,
            price: selectedFlight.price,
            origin: selectedFlight.origin,
            destination: selectedFlight.destination,
            departureDate: selectedFlight.departure_date,
            returnDate: selectedFlight.return_date || undefined,
            passengers: searchParams.passengers,
            cabinClass: selectedFlight.class,
            ...generateMockTimes()
          }}
        />
      )}
    </Card>
  );
};

export default PriceComparison;
