
import React, { useState } from "react";
import SearchForm from "./SearchForm";
import PriceComparison from "./PriceComparison";
import { SearchParams } from "@/types/flight";
import { toast } from "@/hooks/use-toast";

const FlightSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
