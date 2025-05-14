
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Parse the request body
    const { origin, destination, departureDate, returnDate, cabinClass, passengers } = await req.json();

    console.log(`Searching flights: ${origin} to ${destination} on ${departureDate}`);

    // Check if we have cached data first
    const { data: cachedData, error: cacheError } = await supabase
      .from('flight_data')
      .select('*')
      .eq('origin', origin)
      .eq('destination', destination)
      .eq('departure_date', departureDate)
      .eq('class', cabinClass)
      .is('return_date', returnDate ? returnDate : null)
      .order('price', { ascending: true });

    // If we have recent cached data (less than 1 hour old), return it
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recentCachedData = cachedData?.filter(d => new Date(d.cached_at) > new Date(oneHourAgo));

    if (recentCachedData && recentCachedData.length > 0) {
      console.log('Returning cached flight data');
      return new Response(JSON.stringify({ 
        flights: recentCachedData,
        source: 'cache'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // In a real implementation, we would call an external flight API here
    // For demonstration, we'll generate realistic mock data for Indian airlines
    const indianAirlines = [
      { name: "Air India", logo: "https://via.placeholder.com/50?text=AirIndia" },
      { name: "IndiGo", logo: "https://via.placeholder.com/50?text=IndiGo" },
      { name: "SpiceJet", logo: "https://via.placeholder.com/50?text=SpiceJet" },
      { name: "Vistara", logo: "https://via.placeholder.com/50?text=Vistara" },
      { name: "Go First", logo: "https://via.placeholder.com/50?text=GoFirst" },
      { name: "Air Asia India", logo: "https://via.placeholder.com/50?text=AirAsia" },
    ];
    
    const travelWebsites = [
      { name: "MakeMyTrip", logo: "https://via.placeholder.com/50?text=MMT" },
      { name: "Paytm", logo: "https://via.placeholder.com/50?text=Paytm" },
      { name: "Cleartrip", logo: "https://via.placeholder.com/50?text=CT" },
      { name: "Yatra", logo: "https://via.placeholder.com/50?text=Yatra" },
      { name: "EaseMyTrip", logo: "https://via.placeholder.com/50?text=EMT" },
      { name: "Ixigo", logo: "https://via.placeholder.com/50?text=Ixigo" },
    ];
    
    // Generate a consistent base price based on the route
    const originCode = origin.charCodeAt(0) + origin.charCodeAt(1) + origin.charCodeAt(2);
    const destCode = destination.charCodeAt(0) + destination.charCodeAt(1) + destination.charCodeAt(2);
    const routeHash = (originCode * destCode) % 10000;
    
    // Base price varies by route (₹3,000 to ₹12,000)
    let basePrice = 3000 + (routeHash % 9000);
    
    // Adjust for cabin class
    if (cabinClass === 'business') basePrice *= 2.5;
    if (cabinClass === 'first') basePrice *= 4;
    
    // Date-based adjustments
    const departureDay = new Date(departureDate).getDay();
    const isWeekend = departureDay === 0 || departureDay === 6;
    if (isWeekend) basePrice *= 1.2;
    
    // How close is the departure date?
    const daysToFlight = Math.max(0, (new Date(departureDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const urgencyMultiplier = daysToFlight < 7 ? 1.3 : (daysToFlight < 14 ? 1.1 : 1.0);
    basePrice *= urgencyMultiplier;
    
    // Generate flights
    const flightCount = 10 + (routeHash % 10); // 10-20 flights
    const flights = [];
    
    for (let i = 0; i < flightCount; i++) {
      const airline = indianAirlines[i % indianAirlines.length];
      const website = travelWebsites[i % travelWebsites.length];
      
      // Price variations between airlines (±20%)
      const priceVariation = 0.8 + (Math.random() * 0.4);
      const price = Math.round(basePrice * priceVariation);
      
      // Random departure time between 6am and 10pm
      const departureHour = Math.floor(Math.random() * 16) + 6;
      const departureMinute = Math.floor(Math.random() * 60);
      const departureTime = `${departureHour.toString().padStart(2, "0")}:${departureMinute.toString().padStart(2, "0")}`;
      
      // Random flight duration (between 1 and 5 hours for domestic flights)
      const durationHours = Math.floor(Math.random() * 4) + 1;
      const durationMinutes = Math.floor(Math.random() * 60);
      
      // Calculate arrival time
      let arrivalHour = departureHour + durationHours;
      let arrivalMinute = departureMinute + durationMinutes;
      
      if (arrivalMinute >= 60) {
        arrivalHour += 1;
        arrivalMinute -= 60;
      }
      
      arrivalHour = arrivalHour % 24;
      
      const arrivalTime = `${arrivalHour.toString().padStart(2, "0")}:${arrivalMinute.toString().padStart(2, "0")}`;
      
      // Number of stops
      const stops = Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0;
      
      // Create the flight object
      const flight = {
        id: `flight-${i}-${Date.now()}`,
        airline: airline.name,
        airlineLogo: airline.logo,
        origin,
        destination,
        departureTime,
        arrivalTime,
        duration: `${durationHours}h ${durationMinutes}m`,
        stops,
        price,
        website: website.name,
        websiteLogo: website.logo,
        departureDate,
        returnDate: returnDate || null,
        class: cabinClass,
        currency: 'INR'
      };
      
      flights.push(flight);
      
      // Store in database for caching
      const { error: insertError } = await supabase
        .from('flight_data')
        .upsert({
          origin,
          destination,
          departure_date: departureDate,
          return_date: returnDate || null,
          airline: airline.name,
          price,
          currency: 'INR',
          class: cabinClass,
          cached_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('Error caching flight data:', insertError);
      }
    }
    
    // Also generate and store price predictions
    await generatePricePredictions(supabase, origin, destination, departureDate, basePrice);
    
    return new Response(JSON.stringify({ 
      flights: flights.sort((a, b) => a.price - b.price),
      source: 'api' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generatePricePredictions(supabase, origin, destination, departureDate, basePrice) {
  try {
    const startDate = new Date(departureDate);
    const predictions = [];
    
    // Generate predictions for 30 days around the departure date
    for (let i = -7; i <= 22; i++) {
      const predictionDate = new Date(startDate);
      predictionDate.setDate(startDate.getDate() + i);
      
      // Skip dates in the past
      if (predictionDate < new Date()) continue;
      
      const dateString = predictionDate.toISOString().split('T')[0];
      
      // Random variations for prediction prices
      const dayOfWeek = predictionDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const priceMultiplier = isWeekend ? 1.2 : 1.0;
      
      // Distance from today affects price
      const daysFromToday = Math.max(0, (predictionDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      const urgencyMultiplier = daysFromToday < 7 ? 1.3 : (daysFromToday < 14 ? 1.1 : 1.0);
      
      // Calculate average price with these factors
      const averagePrice = Math.round(basePrice * priceMultiplier * urgencyMultiplier);
      const lowestPrice = Math.round(averagePrice * 0.8);
      const highestPrice = Math.round(averagePrice * 1.2);
      
      // Determine recommendation
      let recommendation = 'neutral';
      
      if (lowestPrice < basePrice * 0.9 && daysFromToday < 14 && daysFromToday > 3) {
        recommendation = 'buy';
      } else if (highestPrice > basePrice * 1.1 || daysFromToday > 21) {
        recommendation = 'wait';
      }
      
      // Random confidence between 70-95%
      const confidence = Math.floor(Math.random() * 25) + 70;
      
      // Store in the database
      const { error: predictionError } = await supabase
        .from('price_predictions')
        .upsert({
          origin,
          destination,
          date: dateString,
          lowest_price: lowestPrice,
          highest_price: highestPrice,
          average_price: averagePrice,
          recommendation,
          confidence,
          last_updated: new Date().toISOString()
        });
      
      if (predictionError) {
        console.error('Error storing price prediction:', predictionError);
      }
    }
  } catch (error) {
    console.error('Error generating price predictions:', error);
  }
}
