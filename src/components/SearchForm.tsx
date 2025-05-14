
import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchParams } from "@/types/flight";

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
  });

  const [tripType, setTripType] = useState<"oneWay" | "roundTrip">("roundTrip");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSearchParams((prev) => ({ 
      ...prev, 
      [name]: name === "passengers" ? parseInt(value) : value 
    }));
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
          <Input
            id="origin"
            name="origin"
            placeholder="City or Airport"
            value={searchParams.origin}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="destination">To</Label>
          <Input
            id="destination"
            name="destination"
            placeholder="City or Airport"
            value={searchParams.destination}
            onChange={handleChange}
            required
            className="mt-1"
          />
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
              onChange={handleChange}
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
                onChange={handleChange}
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
