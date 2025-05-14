
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Airline logos for major Indian carriers
const airlineLogos = {
  "Air India": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Air_India_Logo.svg",
  "IndiGo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/IndiGo_Airlines_logo.svg/2560px-IndiGo_Airlines_logo.svg.png",
  "SpiceJet": "https://upload.wikimedia.org/wikipedia/commons/5/5d/SpiceJet_Logo.svg",
  "Vistara": "https://upload.wikimedia.org/wikipedia/en/f/f6/Vistara_airline_logo.svg",
  "Go First": "https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Go_First_logo.svg/1200px-Go_First_logo.svg.png",
  "AirAsia India": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/2560px-AirAsia_New_Logo.svg.png",
  "Alliance Air": "https://upload.wikimedia.org/wikipedia/en/b/b0/Alliance_Air_logo.png",
  "TruJet": "https://upload.wikimedia.org/wikipedia/commons/8/8c/TruJet_logo.png",
  "Star Air": "https://upload.wikimedia.org/wikipedia/en/4/48/Star_Air_%28India%29_logo.svg",
  "Akasa Air": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Akasa_Air_logo.svg/1200px-Akasa_Air_logo.svg.png"
};

// Website logos for Indian travel portals
const websiteLogos = {
  "MakeMyTrip": "https://imgak.mmtcdn.com/pwa_v3/pwa_hotel_assets/header/mmtLogoWhite.png",
  "Paytm": "https://upload.wikimedia.org/wikipedia/commons/4/42/Paytm_logo.png",
  "Cleartrip": "https://seeklogo.com/images/C/cleartrip-logo-22AE3BF11E-seeklogo.com.png",
  "Yatra": "https://upload.wikimedia.org/wikipedia/commons/7/71/Yatra_2018.png",
  "EaseMyTrip": "https://upload.wikimedia.org/wikipedia/commons/b/b9/EaseMyTrip_Logo.png",
  "Ixigo": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Ixigo_Logo.png",
  "Goibibo": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Goibibo_logo.svg"
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
    
    // Amadeus API credentials
    const amadeus_api_key = Deno.env.get('AMADEUS_API_KEY') ?? 'tXAyTZgku1b3VnKfUbjukzUgClFAik0e';
    const amadeus_api_secret = Deno.env.get('AMADEUS_API_SECRET') ?? 'Ym91W1skpDYgTOHH';

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
      
      // Transform the cached data into the expected format
      const flights = recentCachedData.map(flight => ({
        id: flight.id,
        airline: flight.airline,
        airlineLogo: airlineLogos[flight.airline] || `https://via.placeholder.com/50?text=${encodeURIComponent(flight.airline)}`,
        origin: flight.origin,
        destination: flight.destination,
        departureTime: "09:00", // These would be available in real API data
        arrivalTime: "11:30",   // These would be available in real API data
        duration: "2h 30m",     // These would be available in real API data
        stops: 0,               // These would be available in real API data
        price: parseFloat(flight.price),
        website: Object.keys(websiteLogos)[Math.floor(Math.random() * Object.keys(websiteLogos).length)],
        websiteLogo: Object.values(websiteLogos)[Math.floor(Math.random() * Object.values(websiteLogos).length)],
        departureDate: flight.departure_date,
        returnDate: flight.return_date,
        class: flight.class,
        currency: flight.currency
      }));
      
      return new Response(JSON.stringify({ 
        flights,
        source: 'cache'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // In a real implementation, we would call the Amadeus API here
    // For now, we'll generate realistic mock data for Indian airlines
    
    // Try to get an Amadeus access token (in a real implementation)
    let amadeus_token = null;
    try {
      const tokenResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials',
          'client_id': amadeus_api_key,
          'client_secret': amadeus_api_secret
        })
      });
      
      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        amadeus_token = tokenData.access_token;
        console.log('Successfully obtained Amadeus access token');
      } else {
        console.error('Error getting Amadeus token:', await tokenResponse.text());
      }
    } catch (error) {
      console.error('Exception getting Amadeus token:', error);
    }
    
    // List of real Indian airlines
    const indianAirlines = Object.keys(airlineLogos);
    
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
    
    // Travel websites in India
    const travelWebsites = Object.keys(websiteLogos);
    
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
        airline,
        airlineLogo: airlineLogos[airline] || `https://via.placeholder.com/50?text=${encodeURIComponent(airline)}`,
        origin,
        destination,
        departureTime,
        arrivalTime,
        duration: `${durationHours}h ${durationMinutes}m`,
        stops,
        price,
        website,
        websiteLogo: websiteLogos[website] || `https://via.placeholder.com/50?text=${encodeURIComponent(website)}`,
        departureDate,
        returnDate: returnDate || null,
        class: cabinClass,
        currency: 'INR'
      };
      
      flights.push(flight);
      
      // Store in database for caching
      try {
        const { error: insertError } = await supabase
          .from('flight_data')
          .upsert({
            origin,
            destination,
            departure_date: departureDate,
            return_date: returnDate || null,
            airline: airline,
            price,
            currency: 'INR',
            class: cabinClass,
            cached_at: new Date().toISOString()
          });
        
        if (insertError) {
          console.error('Error caching flight data:', insertError);
        }
      } catch (err) {
        console.error('Exception caching flight data:', err);
      }
    }
    
    // Also generate and store price predictions
    await generatePricePredictions(supabase, origin, destination, departureDate, basePrice, amadeus_token);
    
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

async function generatePricePredictions(supabase, origin, destination, departureDate, basePrice, amadeus_token) {
  try {
    const startDate = new Date(departureDate);
    const predictions = [];
    
    // If we have an Amadeus token, we could try to get real price predictions
    if (amadeus_token) {
      try {
        console.log('Would use Amadeus API for real predictions if this was a production implementation');
        // In a real implementation, we would call Amadeus Price Forecast endpoint here
      } catch (error) {
        console.error('Error calling Amadeus API:', error);
      }
    }
    
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
      try {
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
      } catch (err) {
        console.error('Exception storing price prediction:', err);
      }
    }
  } catch (error) {
    console.error('Error generating price predictions:', error);
  }
}
