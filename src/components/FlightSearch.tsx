
import React, { useState } from "react";
import SearchForm from "./SearchForm";
import PriceComparison from "./PriceComparison";
import { SearchParams } from "@/types/flight";
import { toast } from "@/hooks/use-toast";
import { Flight } from "@/types/flight";
import FlightCard from "./FlightCard";
import { useBookingContext } from "@/contexts/BookingContext";

const FlightSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { setFlightBooking } = useBookingContext();

  const handleSearch = (params: SearchParams) => {
    if (!params.origin || !params.destination) {
      toast({
        title: "Search Error",
        description: "Please select both origin and destination airports.",
        variant: "destructive"
      });
      return;
    }
    if (params.origin === params.destination) {
      toast({
        title: "Search Error",
        description: "Origin and destination airports cannot be the same.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    setSearchParams(params);
    toast({
      title: "Searching Flights",
      description: `Finding flights from ${params.origin} to ${params.destination}`
    });

    // The loading state will be handled by the child component
  };

  const handleBookFlight = (flightDetails: Partial<Flight>) => {
    // Create a complete Flight object
    const flight: Flight = {
      id: flightDetails.id || `flight-${Date.now()}`,
      airline: flightDetails.airline || "",
      airlineLogo: flightDetails.airlineLogo || "",
      origin: flightDetails.origin || "",
      destination: flightDetails.destination || "",
      departureDate: flightDetails.departureDate || new Date().toISOString().split('T')[0],
      departureTime: flightDetails.departureTime || "",
      arrivalTime: flightDetails.arrivalTime || "",
      duration: flightDetails.duration || "",
      stops: flightDetails.stops || 0,
      price: flightDetails.price || 0,
      website: flightDetails.website || "",
      websiteLogo: flightDetails.websiteLogo || "",
      flightNumber: flightDetails.flightNumber,
      cabinClass: flightDetails.cabinClass,
      passengers: flightDetails.passengers || 1
    };

    setFlightBooking(flight);
    
    toast({
      title: "Flight Selected",
      description: `${flight.airline} flight has been added to your trip planning`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6">
        <div className="col-span-1">
          <SearchForm onSearch={handleSearch} />
        </div>

        {searchParams && (
          <div className="col-span-1 flex justify-center">
            <div className="w-full">
              <div className="mt-6 w-full">
                <PriceComparison 
                  origin={searchParams.origin}
                  destination={searchParams.destination}
                  departureDate={searchParams.departureDate}
                  returnDate={searchParams.returnDate}
                  passengers={searchParams.passengers}
                  cabinClass={searchParams.cabinClass}
                  onSelectFlight={handleBookFlight}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearch;
