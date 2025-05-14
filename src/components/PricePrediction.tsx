
import React, { useEffect, useState } from "react";
import { PricePrediction as PricePredictionType, SearchParams } from "@/types/flight";
import PriceChart from "./PriceChart";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { indianAirports } from "@/data/indianAirports";

interface PricePredictionProps {
  searchParams: SearchParams;
  loading: boolean;
}

const PricePrediction: React.FC<PricePredictionProps> = ({ searchParams, loading: initialLoading }) => {
  const [predictions, setPredictions] = useState<PricePredictionType[]>([]);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  
  useEffect(() => {
    const fetchPredictions = async () => {
      if (!searchParams) return;
      
      setLoading(true);
      
      try {
        // First try to get predictions from the database
        const { data, error } = await supabase
          .from('price_predictions')
          .select('*')
          .eq('origin', searchParams.origin)
          .eq('destination', searchParams.destination)
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true });
        
        if (error) {
          console.error('Error fetching price predictions:', error);
          setPredictions([]);
          return;
        }
        
        if (data && data.length > 0) {
          // Transform the data to match our PricePrediction type
          const formattedPredictions: PricePredictionType[] = data.map(item => ({
            date: item.date,
            lowestPrice: Number(item.lowest_price),
            highestPrice: Number(item.highest_price),
            averagePrice: Number(item.average_price),
            recommendation: item.recommendation as 'buy' | 'wait' | 'neutral',
            confidence: item.confidence
          }));
          
          setPredictions(formattedPredictions);
        } else {
          // If no predictions in DB, trigger the edge function to generate them
          const { error: fnError } = await supabase.functions.invoke('flight-prices', {
            body: {
              origin: searchParams.origin,
              destination: searchParams.destination,
              departureDate: searchParams.departureDate,
              returnDate: searchParams.returnDate,
              cabinClass: searchParams.cabinClass,
              passengers: searchParams.passengers
            }
          });
          
          if (fnError) {
            console.error('Error generating predictions:', fnError);
            toast({
              title: "Error generating predictions",
              description: "Could not retrieve price predictions. Please try again later.",
              variant: "destructive"
            });
            setPredictions([]);
            return;
          }
          
          // Now fetch the newly generated predictions
          const { data: newData, error: newError } = await supabase
            .from('price_predictions')
            .select('*')
            .eq('origin', searchParams.origin)
            .eq('destination', searchParams.destination)
            .gte('date', new Date().toISOString().split('T')[0])
            .order('date', { ascending: true });
          
          if (newError) {
            console.error('Error fetching new price predictions:', newError);
            setPredictions([]);
            return;
          }
          
          // Transform the data
          const formattedPredictions: PricePredictionType[] = newData.map(item => ({
            date: item.date,
            lowestPrice: Number(item.lowest_price),
            highestPrice: Number(item.highest_price),
            averagePrice: Number(item.average_price),
            recommendation: item.recommendation as 'buy' | 'wait' | 'neutral',
            confidence: item.confidence
          }));
          
          setPredictions(formattedPredictions);
        }
      } catch (err) {
        console.error('Error in price prediction fetch:', err);
        toast({
          title: "Connection error",
          description: "Could not connect to price prediction service. Please try again later.",
          variant: "destructive"
        });
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPredictions();
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
  
  // Find the origin and destination city names
  const originCity = indianAirports.find(airport => airport.code === searchParams.origin)?.city || searchParams.origin;
  const destinationCity = indianAirports.find(airport => airport.code === searchParams.destination)?.city || searchParams.destination;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-3">
        <PriceChart 
          predictions={predictions} 
          originCity={originCity}
          destinationCity={destinationCity}
        />
      </div>
      <div className="md:col-span-3">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Price Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-md">
              <h4 className="font-medium text-green-800 mb-2">Best Time to Book</h4>
              <p className="text-lg font-bold text-green-700">
                {new Date(bestTime.date).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-green-600">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR'
                }).format(bestTime.lowestPrice)}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">Price Range</h4>
              <p className="text-lg font-bold text-blue-700">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR'
                }).format(Math.min(...predictions.map(p => p.lowestPrice)))} - 
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR'
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
            <h4 className="font-medium text-amber-800 mb-2">Indian Flight Price Trends</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-amber-700">
              <li>Prices typically increase 21 days before departure for domestic Indian flights</li>
              <li>Festival seasons like Diwali and Christmas see fare increases of up to 40%</li>
              <li>Flights on Tuesday and Wednesday mornings tend to be cheapest</li>
              <li>Late night flights (after 9 PM) often have better deals</li>
              <li>Booking 4-5 weeks in advance usually offers the best prices for domestic routes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricePrediction;
