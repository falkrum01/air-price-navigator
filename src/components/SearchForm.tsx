
import React, { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchParams } from "@/types/flight";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { indianAirports } from "@/data/indianAirports";

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: "",
    destination: "",
    departureDate: new Date().toISOString().split('T')[0],
    returnDate: "",
    passengers: 1,
    cabinClass: "economy",
    currency: "INR", // Set default currency to INR
  });

  const [tripType, setTripType] = useState<"oneWay" | "roundTrip">("roundTrip");
  const [openOrigin, setOpenOrigin] = useState(false);
  const [openDestination, setOpenDestination] = useState(false);
  const [originQuery, setOriginQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");

  const filteredOrigins = useMemo(() => {
    return indianAirports.filter((airport) => 
      airport.city.toLowerCase().includes(originQuery.toLowerCase()) || 
      airport.name.toLowerCase().includes(originQuery.toLowerCase()) ||
      airport.code.toLowerCase().includes(originQuery.toLowerCase())
    );
  }, [originQuery]);

  const filteredDestinations = useMemo(() => {
    return indianAirports.filter((airport) => 
      airport.city.toLowerCase().includes(destinationQuery.toLowerCase()) || 
      airport.name.toLowerCase().includes(destinationQuery.toLowerCase()) ||
      airport.code.toLowerCase().includes(destinationQuery.toLowerCase())
    );
  }, [destinationQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSearchParams((prev) => ({ 
      ...prev, 
      [name]: name === "passengers" ? parseInt(value) : value 
    }));
  };

  const handleAirportSelect = (type: 'origin' | 'destination', airport: string) => {
    setSearchParams(prev => ({
      ...prev,
      [type]: airport
    }));
    
    if (type === 'origin') {
      setOpenOrigin(false);
    } else {
      setOpenDestination(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex gap-4 mb-4">
        <Button
          type="button"
          onClick={() => setTripType("roundTrip")}
          className={`flex-1 ${
            tripType === "roundTrip"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          variant={tripType === "roundTrip" ? "default" : "outline"}
        >
          Round Trip
        </Button>
        <Button
          type="button"
          onClick={() => {
            setTripType("oneWay");
            setSearchParams(prev => ({ ...prev, returnDate: undefined }));
          }}
          className={`flex-1 ${
            tripType === "oneWay"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          variant={tripType === "oneWay" ? "default" : "outline"}
        >
          One Way
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="origin">From</Label>
          <Popover open={openOrigin} onOpenChange={setOpenOrigin}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openOrigin}
                className="w-full justify-between h-10 mt-1 font-normal bg-background"
              >
                {searchParams.origin ? 
                  indianAirports.find(airport => airport.code === searchParams.origin)?.city + 
                  " (" + indianAirports.find(airport => airport.code === searchParams.origin)?.code + ")" :
                  "Select city or airport"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search airport..." 
                  value={originQuery}
                  onValueChange={setOriginQuery}
                />
                <CommandList>
                  <CommandEmpty>No airports found.</CommandEmpty>
                  <CommandGroup>
                    {filteredOrigins.map((airport) => (
                      <CommandItem
                        key={airport.code}
                        value={airport.code}
                        onSelect={() => handleAirportSelect('origin', airport.code)}
                      >
                        <span>{airport.city} ({airport.code})</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {airport.name}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="destination">To</Label>
          <Popover open={openDestination} onOpenChange={setOpenDestination}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openDestination}
                className="w-full justify-between h-10 mt-1 font-normal bg-background"
              >
                {searchParams.destination ? 
                  indianAirports.find(airport => airport.code === searchParams.destination)?.city + 
                  " (" + indianAirports.find(airport => airport.code === searchParams.destination)?.code + ")" : 
                  "Select city or airport"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search airport..." 
                  value={destinationQuery}
                  onValueChange={setDestinationQuery}
                />
                <CommandList>
                  <CommandEmpty>No airports found.</CommandEmpty>
                  <CommandGroup>
                    {filteredDestinations.map((airport) => (
                      <CommandItem
                        key={airport.code}
                        value={airport.code}
                        onSelect={() => handleAirportSelect('destination', airport.code)}
                      >
                        <span>{airport.city} ({airport.code})</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {airport.name}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="departureDate">Departure Date</Label>
          <div className="relative mt-1">
            <Input
              id="departureDate"
              name="departureDate"
              type="date"
              value={searchParams.departureDate}
              onChange={handleInputChange}
              required
              className="pl-10"
              min={new Date().toISOString().split('T')[0]}
            />
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          </div>
        </div>
        
        {tripType === "roundTrip" && (
          <div>
            <Label htmlFor="returnDate">Return Date</Label>
            <div className="relative mt-1">
              <Input
                id="returnDate"
                name="returnDate"
                type="date"
                value={searchParams.returnDate || ""}
                onChange={handleInputChange}
                required={tripType === "roundTrip"}
                className="pl-10"
                min={searchParams.departureDate}
              />
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="passengers">Passengers</Label>
          <Select
            value={searchParams.passengers.toString()}
            onValueChange={(value) => handleSelectChange("passengers", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select passengers" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Passenger" : "Passengers"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="cabinClass">Cabin Class</Label>
          <Select
            value={searchParams.cabinClass}
            onValueChange={(value) => 
              handleSelectChange("cabinClass", value as "economy" | "business" | "first")
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="first">First Class</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button type="submit" className="w-full bg-airblue hover:bg-airblue-dark">
        Search Flights
      </Button>
    </form>
  );
};

export default SearchForm;
