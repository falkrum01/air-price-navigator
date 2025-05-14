
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchForm from "./SearchForm";
import PriceComparison from "./PriceComparison";
import PricePrediction from "./PricePrediction";
import { SearchParams } from "@/types/flight";
import { toast } from "@/components/ui/use-toast";

const FlightSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("comparison");

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
      description: `Finding flights from ${params.origin} to ${params.destination}`,
    });
    
    // The loading state will be handled by the child components
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6">
        <div className="col-span-1">
          <SearchForm onSearch={handleSearch} />
        </div>

        {searchParams && (
          <div className="col-span-1">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="comparison">Price Comparison</TabsTrigger>
                <TabsTrigger value="prediction">Price Prediction</TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <TabsContent value="comparison" className="mt-0">
                  <PriceComparison 
                    searchParams={searchParams}
                    loading={loading && activeTab === "comparison"}
                  />
                </TabsContent>
                
                <TabsContent value="prediction" className="mt-0">
                  <PricePrediction
                    searchParams={searchParams}
                    loading={loading && activeTab === "prediction"}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearch;
