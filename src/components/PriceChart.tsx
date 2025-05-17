
import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Flight } from "@/types/flight";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PriceChartProps {
  flights: Flight[];
}

const PriceChart: React.FC<PriceChartProps> = ({ flights }) => {
  // Sort flights by price to show from lowest to highest
  const sortedFlights = [...flights].sort((a, b) => a.price - b.price);

  // Format data for the chart
  const data = sortedFlights.map((flight) => ({
    name: flight.airline,
    price: flight.price,
    color: "#0284c7"
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Price Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip formatter={(value) => [`₹${value}`, 'Price']} />
              <Bar dataKey="price" fill="#0284c7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
