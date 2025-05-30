
import React, { useState } from "react";
import { Calendar } from "lucide-react"; // Import Calendar from lucide-react
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchParams } from "@/types/flight";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { indianAirports } from "@/data/indianAirports";

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [tripType, setTripType] = useState("one-way");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState("1");
  const [cabinClass, setCabinClass] = useState("economy");
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  // State for date selection only
  // No need for open/close state with Select component

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields before searching
    if (!origin || !destination || !departureDate) {
      return;
    }

    // Create search params object with proper date conversions
    const searchParams: SearchParams = {
      origin,
      destination,
      departureDate: departureDate.toISOString().split('T')[0], // Convert Date to string
      returnDate: tripType === "round" && returnDate ? returnDate.toISOString().split('T')[0] : undefined,
      passengers: parseInt(passengers),
      cabinClass
    };
    
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Trip Type */}
      <div className="col-span-1 md:col-span-3 flex justify-center space-x-4">
        <Button
          type="button"
          variant={tripType === "one-way" ? "default" : "outline"}
          onClick={() => setTripType("one-way")}
        >
          One Way
        </Button>
        <Button
          type="button"
          variant={tripType === "round" ? "default" : "outline"}
          onClick={() => setTripType("round")}
        >
          Round Trip
        </Button>
      </div>

      {/* Origin */}
      <div>
        <Label htmlFor="origin">Origin</Label>
        <Select value={origin} onValueChange={setOrigin}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select origin airport" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {indianAirports.map((airport) => (
              <SelectItem key={airport.iata_code} value={airport.iata_code}>
                {airport.city} - {airport.name} ({airport.iata_code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Destination */}
      <div>
        <Label htmlFor="destination">Destination</Label>
        <Select value={destination} onValueChange={setDestination}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select destination airport" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {indianAirports.map((airport) => (
              <SelectItem key={airport.iata_code} value={airport.iata_code}>
                {airport.city} - {airport.name} ({airport.iata_code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Selection */}
      <div>
        <Label>Departure Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date?.from && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {departureDate ? (
                tripType === "round" && returnDate ? (
                  `${departureDate.toLocaleDateString()} - ${returnDate.toLocaleDateString()}`
                ) : (
                  departureDate.toLocaleDateString()
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <div className="border rounded-md p-2">
              <React.Fragment>
                <Label>Departure Date</Label>
                <Input
                  type="date"
                  value={departureDate ? departureDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setDepartureDate(e.target.value ? new Date(e.target.value) : undefined)}
                  className="mb-2"
                />
                {tripType === "round" && (
                  <>
                    <Label>Return Date</Label>
                    <Input
                      type="date"
                      value={returnDate ? returnDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setReturnDate(e.target.value ? new Date(e.target.value) : undefined)}
                    />
                  </>
                )}
              </React.Fragment>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Passengers */}
      <div>
        <Label htmlFor="passengers">Passengers</Label>
        <Select value={passengers} onValueChange={setPassengers}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select number of passengers" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(9)].map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cabin Class */}
      <div>
        <Label htmlFor="cabinClass">Cabin Class</Label>
        <Select value={cabinClass} onValueChange={setCabinClass}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select cabin class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="economy">Economy</SelectItem>
            <SelectItem value="premium-economy">Premium Economy</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="first">First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <div className="col-span-1 md:col-span-3 flex justify-center">
        <Button type="submit" className="bg-airblue hover:bg-airblue-dark">
          Search Flights
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;
