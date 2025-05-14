
import React from "react";
import { Button } from "@/components/ui/button";
import { Flight } from "@/types/flight";
import { ArrowRight } from "lucide-react";

interface FlightCardProps {
  flight: Flight;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const {
    airline,
    airlineLogo,
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

  // Format the price to include currency symbol and no decimal places
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div className="bg-white border rounded-lg p-4 mb-4 transition-all hover:shadow-md animate-fade-in">
      <div className="flex justify-between flex-wrap gap-4">
        {/* Airline info */}
        <div className="flex items-center space-x-3">
          <img
            src={airlineLogo || "/placeholder.svg"}
            alt={airline}
            className="w-8 h-8 object-contain"
          />
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
            src={websiteLogo || "/placeholder.svg"}
            alt={website}
            className="w-8 h-8 object-contain"
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
          <Button className="w-full bg-airorange hover:bg-airorange/90">
            Select
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
