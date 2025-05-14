
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AirlineFilter from "./AirlineFilter";
import FlightCard from "./FlightCard";
import { Flight, SearchParams, FilterParams } from "@/types/flight";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface PriceComparisonProps {
  searchParams: SearchParams;
  loading: boolean;
}

const PriceComparison: React.FC<PriceComparisonProps> = ({ searchParams, loading: initialLoading }) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departure">("price");
  const [filterParams, setFilterParams] = useState<FilterParams>({
    airlines: [],
    websites: [],
  });
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [dataSource, setDataSource] = useState<string>("loading");

  useEffect(() => {
    const fetchFlights = async () => {
      if (!searchParams) return;
      
      setLoading(true);
      
      try {
        // Call the Supabase edge function to get flight data
        const { data, error } = await supabase.functions.invoke('flight-prices', {
          body: {
            origin: searchParams.origin,
            destination: searchParams.destination,
            departureDate: searchParams.departureDate,
            returnDate: searchParams.returnDate,
            cabinClass: searchParams.cabinClass,
            passengers: searchParams.passengers
          }
        });
        
        if (error) {
          console.error('Error fetching flight data:', error);
          toast({
            title: "Error fetching flights",
            description: "Could not retrieve flight information. Please try again later.",
            variant: "destructive"
          });
          setFlights([]);
        } else {
          setFlights(data.flights);
          setDataSource(data.source);
          
          if (data.source === 'cache') {
            toast({
              title: "Using recent flight data",
              description: "Showing flight prices from our cache (less than 1 hour old)."
            });
          }
        }
      } catch (err) {
        console.error('Error in flight data fetch:', err);
        toast({
          title: "Connection error",
          description: "Could not connect to flight search service. Please try again later.",
          variant: "destructive"
        });
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
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
            <div>
              <h2 className="text-lg font-semibold">
                {filteredFlights.length} flights found
              </h2>
              {dataSource === 'cache' && (
                <p className="text-xs text-gray-500">Using cached prices (less than 1 hour old)</p>
              )}
            </div>
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
