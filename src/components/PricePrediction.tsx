
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon, Clock, AlertTriangle, Info } from "lucide-react";

interface PricePredictionProps {
  origin: string;
  destination: string;
  recommendation?: string;
  date?: string;
}

const PricePrediction: React.FC<PricePredictionProps> = ({ 
  origin, 
  destination,
  recommendation = "stable",
  date = new Date().toISOString().split('T')[0]
}) => {
  // Mock data for flight delays and trends
  const flightStats = {
    averageDelay: '25 mins',
    onTimePerformance: '78%',
    delayReasons: {
      weather: '15%',
      airTraffic: '35%',
      technical: '25%',
      other: '25%',
    },
    busiestDays: ['Friday', 'Sunday'],
    bestTimeToBook: '3-4 weeks before departure',
    priceTrend: recommendation === 'buy' ? 'increasing' : recommendation === 'wait' ? 'decreasing' : 'stable',
    historicalLow: '₹3,500',
    historicalHigh: '₹8,200',
    currentPrice: '₹5,800',
  };

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
        return `Prices are likely to increase. Consider booking now.`;
      case "wait":
        return `Prices may drop soon. Consider waiting to book.`;
      default:
        return `Prices are expected to remain stable.`;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Flight Insights: {origin} to {destination}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Prediction */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium flex items-center">
            <Info className="h-4 w-4 mr-2 text-blue-500" />
            Price Prediction
          </h3>
          <div className="mt-2 flex items-center">
            {renderIcon()}
            <span className="ml-2">{getMessage()}</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
            <div className="bg-background p-2 rounded">
              <div className="text-muted-foreground">Current</div>
              <div className="font-medium">₹{flightStats.currentPrice}</div>
            </div>
            <div className="bg-background p-2 rounded">
              <div className="text-muted-foreground">Low</div>
              <div className="text-green-500 font-medium">₹{flightStats.historicalLow}</div>
            </div>
            <div className="bg-background p-2 rounded">
              <div className="text-muted-foreground">High</div>
              <div className="text-red-500 font-medium">₹{flightStats.historicalHigh}</div>
            </div>
          </div>
        </div>

        {/* Flight Delays */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
            Flight Delay Analysis
          </h3>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Average Delay</div>
              <div className="font-medium">{flightStats.averageDelay}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">On-time Performance</div>
              <div className="font-medium">{flightStats.onTimePerformance}</div>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="text-sm text-muted-foreground mb-1">Delay Reasons</div>
            <div className="space-y-1">
              {Object.entries(flightStats.delayReasons).map(([reason, percentage]) => (
                <div key={reason} className="flex items-center text-sm">
                  <div className="w-24 capitalize">{reason}</div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: percentage }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right">{percentage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Travel Tips */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2 text-emerald-500" />
            Travel Tips
          </h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Best time to book: <span className="font-medium">{flightStats.bestTimeToBook}</span></span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Busiest days: <span className="font-medium">{flightStats.busiestDays.join(', ')}</span></span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Consider booking refundable tickets if uncertain about travel dates</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricePrediction;
