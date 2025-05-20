
import React, { useState, useEffect } from "react";
import FlightCard from "@/components/FlightCard";
import { Flight } from "@/types/flight";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PriceComparisonProps {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: string;
  onSelectFlight?: (flight: Partial<Flight>) => void; // New prop for selecting a flight
}

const PriceComparison: React.FC<PriceComparisonProps> = ({
  origin,
  destination,
  departureDate,
  returnDate,
  passengers,
  cabinClass,
  onSelectFlight,
}) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Reset state when search params change
    setLoading(true);
    setFlights([]);

    // In a real app, this would be an API call to fetch flights
    // For now, we'll simulate an API call with a timeout
    const timer = setTimeout(() => {
      // Mock flight data
      const mockFlights: Flight[] = [
        {
          id: "flight1",
          airline: "Air India",
          airlineLogo: "/placeholder.svg",
          origin: origin,
          destination: destination,
          departureDate: departureDate,
          departureTime: "06:30",
          arrivalTime: "09:45",
          duration: "3h 15m",
          stops: 0,
          price: 7500,
          website: "Cheapflights",
          websiteLogo: "/placeholder.svg",
        },
        {
          id: "flight2",
          airline: "IndiGo",
          airlineLogo: "/placeholder.svg",
          origin: origin,
          destination: destination,
          departureDate: departureDate,
          departureTime: "09:15",
          arrivalTime: "12:20",
          duration: "3h 05m",
          stops: 0,
          price: 6800,
          website: "MakeMyTrip",
          websiteLogo: "/placeholder.svg",
        },
        {
          id: "flight3",
          airline: "SpiceJet",
          airlineLogo: "/placeholder.svg",
          origin: origin,
          destination: destination,
          departureDate: departureDate,
          departureTime: "12:30",
          arrivalTime: "16:15",
          duration: "3h 45m",
          stops: 1,
          price: 6200,
          website: "GoIbibo",
          websiteLogo: "/placeholder.svg",
        },
        {
          id: "flight4",
          airline: "Vistara",
          airlineLogo: "/placeholder.svg",
          origin: origin,
          destination: destination,
          departureDate: departureDate,
          departureTime: "15:45",
          arrivalTime: "18:55",
          duration: "3h 10m",
          stops: 0,
          price: 8200,
          website: "Yatra",
          websiteLogo: "/placeholder.svg",
        },
        {
          id: "flight5",
          airline: "Air Asia",
          airlineLogo: "/placeholder.svg",
          origin: origin,
          destination: destination,
          departureDate: departureDate,
          departureTime: "18:20",
          arrivalTime: "21:40",
          duration: "3h 20m",
          stops: 0,
          price: 6500,
          website: "EaseMyTrip",
          websiteLogo: "/placeholder.svg",
        },
        {
          id: "flight6",
          airline: "Go First",
          airlineLogo: "/placeholder.svg",
          origin: origin,
          destination: destination,
          departureDate: departureDate,
          departureTime: "21:15",
          arrivalTime: "00:35",
          duration: "3h 20m",
          stops: 0,
          price: 5900,
          website: "Cleartrip",
          websiteLogo: "/placeholder.svg",
        },
      ];

      setFlights(mockFlights);
      setLoading(false);
    }, 1500); // Simulate network delay

    return () => clearTimeout(timer);
  }, [origin, destination, departureDate, returnDate, passengers, cabinClass]);

  const handleSelectFlight = (flightDetails: Partial<Flight>) => {
    if (onSelectFlight) {
      onSelectFlight({
        ...flightDetails,
        passengers: passengers,
        cabinClass: cabinClass,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-10 w-10 animate-spin text-airblue" />
        <p className="mt-4 text-lg">Searching for the best flight deals...</p>
      </div>
    );
  }

  if (flights.length === 0 && !loading) {
    return (
      <div className="text-center py-8">
        <p className="text-lg">No flights found for your search criteria.</p>
        <p className="text-muted-foreground mt-2">
          Try adjusting your dates or destination.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Found {flights.length} flights</h3>
        <p className="text-muted-foreground">
          From {origin} to {destination} on {departureDate}
        </p>
      </div>

      <div className="space-y-4">
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} onBook={handleSelectFlight} />
        ))}
      </div>
    </div>
  );
};

export default PriceComparison;
