
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

interface PricePredictionProps {
  origin: string;
  destination: string;
  recommendation?: string;
}

const PricePrediction: React.FC<PricePredictionProps> = ({ 
  origin, 
  destination,
  recommendation = "stable" // Default to stable if no recommendation is provided
}) => {
  // Determine which icon to show based on the recommendation
  const renderIcon = () => {
    switch (recommendation.toLowerCase()) {
      case "buy":
        return <ArrowUpIcon className="h-5 w-5 text-red-500" />;
      case "wait":
        return <ArrowDownIcon className="h-5 w-5 text-green-500" />;
      default:
        return <MinusIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get message based on recommendation
  const getMessage = () => {
    switch (recommendation.toLowerCase()) {
      case "buy":
        return "Prices are likely to increase. Consider booking now.";
      case "wait":
        return "Prices may drop soon. Consider waiting to book.";
      default:
        return "Prices are expected to remain stable.";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Price Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {origin} to {destination}
            </p>
            <div className="flex items-center">
              {renderIcon()}
              <span className="ml-2 font-medium">{getMessage()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricePrediction;
