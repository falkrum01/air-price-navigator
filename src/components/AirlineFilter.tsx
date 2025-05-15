
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Flight, FilterParams } from "@/types/flight";

interface AirlineFilterProps {
  flights: Flight[];
  onFilterChange: (filters: FilterParams) => void;
}

const AirlineFilter: React.FC<AirlineFilterProps> = ({ flights, onFilterChange }) => {
  // Extract unique airlines and websites from flights
  const airlines = [...new Set(flights.map((flight) => flight.airline))];
  const websites = [...new Set(flights.map((flight) => flight.website))];
  
  // Find the maximum price
  const maxPrice = Math.max(...flights.map((flight) => flight.price));
  
  // Initial state
  const [filters, setFilters] = useState<FilterParams>({
    airlines: [],
    websites: [],
    maxPrice: maxPrice,
    maxStops: 2,
  });

  // Handle airline checkbox changes
  const handleAirlineChange = (airline: string, checked: boolean) => {
    let updatedAirlines;
    
    if (checked) {
      updatedAirlines = [...filters.airlines, airline];
    } else {
      updatedAirlines = filters.airlines.filter((a) => a !== airline);
    }
    
    const newFilters = { ...filters, airlines: updatedAirlines };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle website checkbox changes
  const handleWebsiteChange = (website: string, checked: boolean) => {
    let updatedWebsites;
    
    if (checked) {
      updatedWebsites = [...(filters.websites || []), website];
    } else {
      updatedWebsites = (filters.websites || []).filter((w) => w !== website);
    }
    
    const newFilters = { ...filters, websites: updatedWebsites };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle price slider change
  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, maxPrice: value[0] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle stops slider change
  const handleStopsChange = (value: number[]) => {
    const newFilters = { ...filters, maxStops: value[0] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div>
        <h3 className="font-medium mb-3">Price</h3>
        <div className="px-2">
          <Slider
            defaultValue={[maxPrice]}
            max={maxPrice}
            step={10}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>₹0</span>
            <span>{formatPrice(filters.maxPrice || 0)}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Stops</h3>
        <div className="px-2">
          <Slider
            defaultValue={[2]}
            min={0}
            max={2}
            step={1}
            onValueChange={handleStopsChange}
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Non-stop</span>
            <span>{filters.maxStops}+ stops</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Airlines</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {airlines.map((airline) => (
            <div key={airline} className="flex items-center space-x-2">
              <Checkbox
                id={`airline-${airline}`}
                onCheckedChange={(checked) =>
                  handleAirlineChange(airline, checked === true)
                }
              />
              <Label
                htmlFor={`airline-${airline}`}
                className="text-sm font-normal flex items-center"
              >
                {airline}
                {flights.find(f => f.airline === airline)?.airlineLogo && (
                  <img 
                    src={flights.find(f => f.airline === airline)?.airlineLogo} 
                    alt={airline}
                    className="h-4 w-auto ml-2 object-contain"
                  />
                )}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Websites</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {websites.map((website) => (
            <div key={website} className="flex items-center space-x-2">
              <Checkbox
                id={`website-${website}`}
                onCheckedChange={(checked) =>
                  handleWebsiteChange(website, checked === true)
                }
              />
              <Label
                htmlFor={`website-${website}`}
                className="text-sm font-normal flex items-center"
              >
                {website}
                {flights.find(f => f.website === website)?.websiteLogo && (
                  <img 
                    src={flights.find(f => f.website === website)?.websiteLogo} 
                    alt={website}
                    className="h-4 w-auto ml-2 object-contain"
                  />
                )}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AirlineFilter;
