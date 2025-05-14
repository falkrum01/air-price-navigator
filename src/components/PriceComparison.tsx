
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AirlineFilter from "./AirlineFilter";
import FlightCard from "./FlightCard";
import { Flight, SearchParams, FilterParams } from "@/types/flight";
import { Skeleton } from "@/components/ui/skeleton";

interface PriceComparisonProps {
  searchParams: SearchParams;
  loading: boolean;
}

const PriceComparison: React.FC<PriceComparisonProps> = ({ searchParams, loading }) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departure">("price");
  const [filterParams, setFilterParams] = useState<FilterParams>({
    airlines: [],
    websites: [],
  });

  // Generate mock flight data
  useEffect(() => {
    if (!searchParams) return;

    // Mock airline data
    const mockAirlines = [
      { name: "Delta Air Lines", logo: "https://via.placeholder.com/50?text=Delta" },
      { name: "United Airlines", logo: "https://via.placeholder.com/50?text=United" },
      { name: "American Airlines", logo: "https://via.placeholder.com/50?text=AA" },
      { name: "Southwest", logo: "https://via.placeholder.com/50?text=SW" },
      { name: "JetBlue", logo: "https://via.placeholder.com/50?text=JB" },
    ];

    // Mock website data
    const mockWebsites = [
      { name: "Expedia", logo: "https://via.placeholder.com/50?text=Expedia" },
      { name: "Kayak", logo: "https://via.placeholder.com/50?text=Kayak" },
      { name: "Orbitz", logo: "https://via.placeholder.com/50?text=Orbitz" },
      { name: "Priceline", logo: "https://via.placeholder.com/50?text=PL" },
      { name: "Skyscanner", logo: "https://via.placeholder.com/50?text=Sky" },
    ];

    // Create mock flight data
    const mockFlights: Flight[] = [];

    // Generate 10-20 random flights
    const flightCount = Math.floor(Math.random() * 10) + 10;

    for (let i = 0; i < flightCount; i++) {
      // Random airline
      const airline = mockAirlines[Math.floor(Math.random() * mockAirlines.length)];
      
      // Random website
      const website = mockWebsites[Math.floor(Math.random() * mockWebsites.length)];
      
      // Random departure time (between 6am and 10pm)
      const departureHour = Math.floor(Math.random() * 16) + 6;
      const departureMinute = Math.floor(Math.random() * 60);
      const departureTime = `${departureHour.toString().padStart(2, "0")}:${departureMinute.toString().padStart(2, "0")}`;
      
      // Random flight duration (between 1 and 8 hours)
      const durationHours = Math.floor(Math.random() * 7) + 1;
      const durationMinutes = Math.floor(Math.random() * 60);
      
      // Calculate arrival time
      let arrivalHour = departureHour + durationHours;
      let arrivalMinute = departureMinute + durationMinutes;
      
      if (arrivalMinute >= 60) {
        arrivalHour += 1;
        arrivalMinute -= 60;
      }
      
      arrivalHour = arrivalHour % 24;
      
      const arrivalTime = `${arrivalHour.toString().padStart(2, "0")}:${arrivalMinute.toString().padStart(2, "0")}`;
      
      // Random number of stops
      const stops = Math.floor(Math.random() * 3);
      
      // Random price (between $100 and $1000)
      const price = Math.floor(Math.random() * 900) + 100;
      
      mockFlights.push({
        id: `flight-${i}`,
        airline: airline.name,
        airlineLogo: airline.logo,
        origin: searchParams.origin,
        destination: searchParams.destination,
        departureTime,
        arrivalTime,
        duration: `${durationHours}h ${durationMinutes}m`,
        stops,
        price,
        website: website.name,
        websiteLogo: website.logo,
      });
    }

    setFlights(mockFlights);
    setFilteredFlights(mockFlights);
  }, [searchParams]);

  useEffect(() => {
    if (!flights.length) return;

    // Apply sorting
    let sorted = [...flights];
    switch (sortBy) {
      case "price":
        sorted = sorted.sort((a, b) => a.price - b.price);
        break;
      case "duration":
        sorted = sorted.sort((a, b) =>
          a.duration.localeCompare(b.duration)
        );
        break;
      case "departure":
        sorted = sorted.sort((a, b) =>
          a.departureTime.localeCompare(b.departureTime)
        );
        break;
    }

    // Apply filters
    let filtered = sorted;

    // Filter by airline if airlines are selected
    if (filterParams.airlines && filterParams.airlines.length > 0) {
      filtered = filtered.filter((flight) =>
        filterParams.airlines.includes(flight.airline)
      );
    }

    // Filter by website if websites are selected
    if (filterParams.websites && filterParams.websites.length > 0) {
      filtered = filtered.filter((flight) =>
        filterParams.websites.includes(flight.website)
      );
    }

    // Filter by maximum price
    if (filterParams.maxPrice !== undefined) {
      filtered = filtered.filter((flight) => flight.price <= filterParams.maxPrice!);
    }

    // Filter by maximum stops
    if (filterParams.maxStops !== undefined) {
      filtered = filtered.filter((flight) => flight.stops <= filterParams.maxStops!);
    }

    setFilteredFlights(filtered);
  }, [flights, sortBy, filterParams]);

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilterParams(newFilters);
  };

  const handleSortChange = (newSortBy: "price" | "duration" | "departure") => {
    setSortBy(newSortBy);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-16 w-1/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!flights.length) {
    return (
      <div className="text-center py-8">
        <p>No flights found. Please try a different search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <AirlineFilter flights={flights} onFilterChange={handleFilterChange} />
      </div>
      <div className="md:col-span-3">
        <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">
              {filteredFlights.length} flights found
            </h2>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={sortBy === "price" ? "default" : "outline"}
                className={sortBy === "price" ? "bg-airblue" : ""}
                onClick={() => handleSortChange("price")}
              >
                Price
              </Button>
              <Button
                size="sm"
                variant={sortBy === "duration" ? "default" : "outline"}
                className={sortBy === "duration" ? "bg-airblue" : ""}
                onClick={() => handleSortChange("duration")}
              >
                Duration
              </Button>
              <Button
                size="sm"
                variant={sortBy === "departure" ? "default" : "outline"}
                className={sortBy === "departure" ? "bg-airblue" : ""}
                onClick={() => handleSortChange("departure")}
              >
                Departure
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredFlights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceComparison;
