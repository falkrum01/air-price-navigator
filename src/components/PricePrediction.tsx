
import React, { useEffect, useState } from "react";
import { PricePrediction as PricePredictionType, SearchParams } from "@/types/flight";
import PriceChart from "./PriceChart";
import { Skeleton } from "@/components/ui/skeleton";

interface PricePredictionProps {
  searchParams: SearchParams;
  loading: boolean;
}

const PricePrediction: React.FC<PricePredictionProps> = ({ searchParams, loading }) => {
  const [predictions, setPredictions] = useState<PricePredictionType[]>([]);
  
  // Generate mock prediction data
  useEffect(() => {
    if (!searchParams) return;
    
    // Generate dates for the next 14 days
    const startDate = new Date(searchParams.departureDate);
    const mockPredictions: PricePredictionType[] = [];
    
    for (let i = -7; i <= 21; i++) {
      const predictionDate = new Date(startDate);
      predictionDate.setDate(startDate.getDate() + i);
      
      // Skip dates before today
      if (predictionDate < new Date()) continue;
      
      // Random base price between $200 and $600
      const basePrice = Math.floor(Math.random() * 400) + 200;
      
      // Simulate price variations (weekends are more expensive)
      const dayOfWeek = predictionDate.getDay(); // 0 is Sunday, 6 is Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      const priceMultiplier = isWeekend ? 1.2 : 1.0;
      
      // Simulate trend where prices rise as the departure date approaches
      const daysToFlight = Math.max(0, (predictionDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      const urgencyMultiplier = daysToFlight < 7 ? 1.3 : 1.0;
      
      // Calculate prices
      const averagePrice = Math.round(basePrice * priceMultiplier * urgencyMultiplier);
      const lowestPrice = Math.round(averagePrice * 0.8);
      const highestPrice = Math.round(averagePrice * 1.2);
      
      // Determine recommendation based on price trend
      let recommendation: 'buy' | 'wait' | 'neutral' = 'neutral';
      
      // Logic: Buy if price is lower than average and likely to increase soon
      if (
        lowestPrice < basePrice * 0.9 && 
        daysToFlight < 14 && 
        daysToFlight > 3
      ) {
        recommendation = 'buy';
      } 
      // Wait if price is higher than average or likely to decrease
      else if (
        highestPrice > basePrice * 1.1 || 
        daysToFlight > 21
      ) {
        recommendation = 'wait';
      }
      
      // Random confidence level between 70% and 95%
      const confidence = Math.floor(Math.random() * 25) + 70;
      
      mockPredictions.push({
        date: predictionDate.toISOString().split('T')[0],
        lowestPrice,
        highestPrice,
        averagePrice,
        recommendation,
        confidence,
      });
    }
    
    setPredictions(mockPredictions);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!predictions.length) {
    return (
      <div className="text-center py-8">
        <p>No prediction data available. Please try a different search.</p>
      </div>
    );
  }

  const bestTime = predictions.reduce(
    (best, current) => (current.lowestPrice < best.lowestPrice ? current : best),
    predictions[0]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-3">
        <PriceChart 
          predictions={predictions} 
          originCity={searchParams.origin}
          destinationCity={searchParams.destination}
        />
      </div>
      <div className="md:col-span-3">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Price Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-md">
              <h4 className="font-medium text-green-800 mb-2">Best Time to Book</h4>
              <p className="text-lg font-bold text-green-700">
                {new Date(bestTime.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-green-600">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(bestTime.lowestPrice)}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">Price Range</h4>
              <p className="text-lg font-bold text-blue-700">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(Math.min(...predictions.map(p => p.lowestPrice)))} - 
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(Math.max(...predictions.map(p => p.highestPrice)))}
              </p>
              <p className="text-sm text-blue-600">Over the next 30 days</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-md">
              <h4 className="font-medium text-purple-800 mb-2">Booking Advice</h4>
              <p className="text-lg font-bold text-purple-700">
                {bestTime.recommendation === 'buy' 
                  ? 'Book Now' 
                  : bestTime.recommendation === 'wait' 
                    ? 'Wait for Better Prices' 
                    : 'Prices are Stable'}
              </p>
              <p className="text-sm text-purple-600">
                {bestTime.recommendation === 'buy'
                  ? 'Prices likely to increase soon'
                  : bestTime.recommendation === 'wait'
                    ? 'Prices may drop in the coming days'
                    : 'Current prices are average for this route'}
              </p>
            </div>
          </div>
          
          <div className="mt-6 bg-amber-50 p-4 rounded-md">
            <h4 className="font-medium text-amber-800 mb-2">Price Prediction Tips</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-amber-700">
              <li>Prices typically increase 21 days before departure</li>
              <li>Weekend flights are typically 20% more expensive</li>
              <li>Booking on Tuesdays or Wednesdays often yields better prices</li>
              <li>Consider nearby airports for potentially lower fares</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricePrediction;
