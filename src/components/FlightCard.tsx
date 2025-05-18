
import React from "react";
import { Button } from "@/components/ui/button";
import { Flight } from "@/types/flight";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { getAirlineLogo } from "@/data/airlineLogos";

interface FlightCardProps {
  flight: Flight;
  onBook: (flightDetails: Partial<Flight> & {
    flightNumber?: string;
    passengers?: number;
    cabinClass?: string;
  }) => void;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, onBook }) => {
  const {
    airline,
    origin,
    destination,
    departureTime,
    arrivalTime,
    duration,
    stops,
    price,
    website,
    websiteLogo,
  } = flight;
  
  // Get airline and website logos from our centralized mapping
  const airlineLogo = getAirlineLogo(airline);
  const websiteLogoUrl = getAirlineLogo(website);

  const navigate = useNavigate();
  const { user } = useAuth();

  // Format the price to include INR currency symbol and no decimal places
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  // Handle booking button click
  const handleBook = () => {
    if (!user) {
      // If user is not logged in, redirect to auth page
      toast({
        title: "Login Required",
        description: "Please log in or sign up to book flights",
        variant: "default",
      });
      navigate('/auth');
      return;
    }
    
    // If user is logged in, proceed with booking
    onBook({
      airline,
      flightNumber: flight.id || `${airline}-${Math.floor(Math.random() * 1000)}`,
      price,
      origin,
      destination,
      departureDate: new Date().toISOString().split('T')[0], // Using current date as an example
      departureTime,
      arrivalTime,
      duration,
      passengers: 1, // Default to 1 passenger
      cabinClass: 'economy', // Default to economy
    });
  };

  return (
    <div className="bg-white border rounded-lg p-4 mb-4 transition-all hover:shadow-md animate-fade-in">
      <div className="flex justify-between flex-wrap gap-4">
        {/* Airline info */}
        <div className="flex items-center space-x-3">
          {airlineLogo ? (
            <img
              src={airlineLogo}
              alt={airline}
              className="h-6 object-contain"
              onError={(e) => {
                console.log(`Failed to load logo for ${airline}`);
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
              {airline.substring(0, 2)}
            </div>
          )}
          <div>
            <p className="font-medium">{airline}</p>
            <p className="text-xs text-muted-foreground">
              {stops === 0
                ? "Non-stop"
                : stops === 1
                ? "1 stop"
                : `${stops} stops`}
            </p>
          </div>
        </div>

        {/* Website info */}
        <div className="flex items-center space-x-3">
          <img
            src={websiteLogoUrl}
            alt={website}
            className="w-10 h-10 object-contain"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <span className="text-sm font-medium">{website}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Flight times */}
        <div className="col-span-2 flex items-center">
          <div className="text-center">
            <p className="text-lg font-bold">{departureTime}</p>
            <p className="text-sm">{origin}</p>
          </div>
          
          <div className="flex-1 mx-2 px-4">
            <div className="relative flex items-center">
              <div className="h-0.5 flex-grow bg-gray-300"></div>
              <ArrowRight className="h-4 w-4 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white" />
            </div>
            <p className="text-xs text-center mt-1 text-muted-foreground">{duration}</p>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-bold">{arrivalTime}</p>
            <p className="text-sm">{destination}</p>
          </div>
        </div>

        {/* Price and booking button */}
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-airblue mb-2">{formattedPrice}</p>
          <Button 
            className="w-full bg-airorange hover:bg-airorange/90"
            onClick={handleBook}
          >
            Book
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
