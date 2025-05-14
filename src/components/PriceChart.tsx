
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PricePrediction } from "@/types/flight";

interface PriceChartProps {
  predictions: PricePrediction[];
  originCity: string;
  destinationCity: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ predictions, originCity, destinationCity }) => {
  // Format the data for the chart
  const data = predictions.map((prediction) => ({
    date: prediction.date,
    lowestPrice: prediction.lowestPrice,
    highestPrice: prediction.highestPrice,
    averagePrice: prediction.averagePrice,
  }));

  // Get the lowest price date and value
  const lowestPrediction = predictions.reduce(
    (lowest, current) => {
      return current.lowestPrice < lowest.lowestPrice ? current : lowest;
    },
    predictions[0]
  );

  // Format the price with currency
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Price Prediction for {originCity} to {destinationCity}
        </CardTitle>
        <CardDescription>
          Analyze price trends to find the best time to book
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="lowestPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1a73e8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="highestPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6d00" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ff6d00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) => `₹${value}`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [`${formatPrice(value as number)}`, ""]}
                labelFormatter={(label) => formatDate(label)}
              />
              <Area
                type="monotone"
                dataKey="lowestPrice"
                name="Lowest Price"
                stroke="#1a73e8"
                fillOpacity={1}
                fill="url(#lowestPrice)"
              />
              <Area
                type="monotone"
                dataKey="highestPrice"
                name="Highest Price"
                stroke="#ff6d00"
                fillOpacity={1}
                fill="url(#highestPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <div className="bg-green-50 p-3 rounded-md w-full">
          <p className="text-green-700 font-medium mb-1">Best Time to Book</p>
          <p className="text-sm">
            {formatDate(lowestPrediction.date)} - {formatPrice(lowestPrediction.lowestPrice)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Confidence: {lowestPrediction.confidence}% accurate based on historical data
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PriceChart;
