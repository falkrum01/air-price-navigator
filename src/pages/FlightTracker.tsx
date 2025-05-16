import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Plane, Filter, RefreshCw, Search, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

// Interface for flight data
interface Flight {
  icao24: string;
  callsign: string;
  origin_country: string;
  time_position: number;
  last_contact: number;
  longitude: number;
  latitude: number;
  baro_altitude: number; // meters
  on_ground: boolean;
  velocity: number; // m/s
  true_track: number; // degrees
  vertical_rate: number; // m/s
  sensors?: number[];
  geo_altitude?: number; // meters
  squawk?: string;
  spi: boolean;
  position_source: number;
  airline?: string;
}

const FlightTracker: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dataTimestamp, setDataTimestamp] = useState<Date>(new Date());
  const [showStats, setShowStats] = useState<boolean>(true);

  // Mock function to fetch flights
  const fetchFlights = async () => {
    setLoading(true);
    try {
      // For demo purposes, generate mock flights
      const mockFlights = generateMockFlights();
      setFlights(mockFlights);
      setFilteredFlights(mockFlights);
      setDataTimestamp(new Date());
      
      toast({
        title: "Flights Updated",
        description: `Loaded ${mockFlights.length} flights`,
      });
    } catch (error) {
      console.error("Error fetching flight data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch flight data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate mock flight data
  const generateMockFlights = (): Flight[] => {
    const countries = ["India", "UAE", "USA", "UK", "Singapore", "Thailand", "China", "Japan", "Australia", "Germany"];
    const airlines = ["Air India", "IndiGo", "SpiceJet", "Vistara", "Emirates", "Singapore Airlines", "British Airways", "Delta", "Qantas"];
    
    return Array(200)
      .fill(null)
      .map((_, index) => {
        const country = countries[Math.floor(Math.random() * countries.length)];
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        const callsign = `${airline.substring(0, 3)}${Math.floor(1000 + Math.random() * 9000)}`;
        
        // Generate coordinates - concentrate more flights around India
        let longitude, latitude;
        if (Math.random() < 0.4) {
          // 40% of flights around India
          longitude = 73 + Math.random() * 25; // Approx longitude range of India
          latitude = 8 + Math.random() * 28; // Approx latitude range of India
        } else {
          // Rest worldwide
          longitude = -180 + Math.random() * 360;
          latitude = -80 + Math.random() * 160;
        }

        return {
          icao24: Math.random().toString(36).substring(2, 8),
          callsign: callsign,
          origin_country: country,
          time_position: Math.floor(Date.now() / 1000),
          last_contact: Math.floor(Date.now() / 1000),
          longitude,
          latitude,
          baro_altitude: Math.random() * 12000,
          on_ground: Math.random() < 0.1, // 10% of flights on ground
          velocity: 200 + Math.random() * 300,
          true_track: Math.random() * 360,
          vertical_rate: -5 + Math.random() * 10,
          spi: false,
          position_source: 0,
          airline
        };
      });
  };

  // Filter flights based on search and country filter
  useEffect(() => {
    let filtered = [...flights];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        flight => 
          flight.callsign?.toLowerCase().includes(term) || 
          flight.airline?.toLowerCase().includes(term)
      );
    }
    
    if (countryFilter && countryFilter !== "all") {
      filtered = filtered.filter(flight => flight.origin_country === countryFilter);
    }
    
    setFilteredFlights(filtered);
  }, [flights, searchTerm, countryFilter]);

  // Initial fetch of flight data
  useEffect(() => {
    fetchFlights();
    
    // Set up periodic refresh (every 30 seconds)
    const refreshInterval = setInterval(fetchFlights, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Get unique countries for the filter
  const countries = [...new Set(flights.map(flight => flight.origin_country))].sort();

  // Handle flight selection
  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    
    // Create a flight ID for FlightRadar24 URL (use callsign or icao24)
    const flightId = flight.callsign?.trim() || flight.icao24;
    
    // Open FlightRadar24 in a new tab
    window.open(`https://www.flightradar24.com/${flightId}`, '_blank');
  };

  // Open general FlightRadar24 website
  const openFlightRadar = () => {
    window.open("https://www.flightradar24.com/14.90,78.33/5", '_blank');
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            {/* Left sidebar */}
            <div className="w-full md:w-1/4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Plane className="h-5 w-5 mr-2 text-airblue" />
                      Flight Tracker
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={fetchFlights}
                      disabled={loading}
                    >
                      <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-4">
                    Last updated: {dataTimestamp.toLocaleTimeString()}
                  </p>
                  
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search flights..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="country-filter">Filter by Country</Label>
                    <Select 
                      value={countryFilter} 
                      onValueChange={setCountryFilter}
                    >
                      <SelectTrigger id="country-filter">
                        <SelectValue placeholder="All Countries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Countries</SelectItem>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {loading ? (
                      Array(5).fill(null).map((_, i) => (
                        <div key={i} className="p-3 border rounded-md">
                          <Skeleton className="h-5 w-1/2 mb-2" />
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                      ))
                    ) : (
                      filteredFlights.slice(0, 15).map((flight) => (
                        <div 
                          key={flight.icao24}
                          className={`p-3 border rounded-md cursor-pointer transition-colors ${
                            selectedFlight?.icao24 === flight.icao24 
                            ? "bg-airblue-light border-airblue" 
                            : "hover:bg-gray-50"
                          }`}
                          onClick={() => handleSelectFlight(flight)}
                        >
                          <div className="font-medium">{flight.callsign}</div>
                          <div className="text-sm text-gray-600">{flight.airline || "Unknown Airline"}</div>
                          <div className="text-xs text-gray-500">From: {flight.origin_country}</div>
                        </div>
                      ))
                    )}
                    
                    {!loading && filteredFlights.length === 0 && (
                      <p className="text-center text-gray-500 py-4">
                        No flights match your filter criteria
                      </p>
                    )}
                    
                    {!loading && filteredFlights.length > 15 && (
                      <p className="text-center text-xs text-gray-500 pt-2">
                        + {filteredFlights.length - 15} more flights
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {showStats && (
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-3">Stats</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border rounded-md p-3 text-center">
                        <div className="text-2xl font-bold text-airblue">{flights.length}</div>
                        <div className="text-xs text-gray-500">Total Flights</div>
                      </div>
                      <div className="border rounded-md p-3 text-center">
                        <div className="text-2xl font-bold text-airblue">{countries.length}</div>
                        <div className="text-xs text-gray-500">Countries</div>
                      </div>
                      <div className="border rounded-md p-3 text-center">
                        <div className="text-2xl font-bold text-airblue">
                          {flights.filter(f => !f.on_ground).length}
                        </div>
                        <div className="text-xs text-gray-500">In Air</div>
                      </div>
                      <div className="border rounded-md p-3 text-center">
                        <div className="text-2xl font-bold text-airblue">
                          {flights.filter(f => f.on_ground).length}
                        </div>
                        <div className="text-xs text-gray-500">On Ground</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Main map area */}
            <div className="w-full md:w-3/4 bg-white rounded-lg shadow-sm border">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h2 className="font-semibold">Live Flight Tracker</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setShowStats(!showStats)}
                  >
                    Toggle Stats
                  </Button>
                  <Button 
                    variant="default"
                    size="sm"
                    onClick={openFlightRadar}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Flight Tracker
                  </Button>
                </div>
              </div>
              
              <div className="relative h-[70vh] flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                  <Plane className="mx-auto h-16 w-16 text-airblue mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Live Flight Tracking</h3>
                  <p className="mb-6 text-gray-600">
                    Click on a flight from the list to view its live tracking information,
                    or open the full Flight Radar tracker to explore all flights.
                  </p>
                  
                  <Button 
                    className="mx-auto"
                    onClick={openFlightRadar}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Flight Radar
                  </Button>
                  
                  <p className="mt-6 text-sm text-gray-500">
                    Flight tracking provided by FlightRadar24
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Selected flight details panel */}
          {selectedFlight && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold">Flight Details: {selectedFlight.callsign}</h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const flightId = selectedFlight.callsign?.trim() || selectedFlight.icao24;
                        window.open(`https://www.flightradar24.com/${flightId}`, '_blank');
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Track This Flight
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedFlight(null)}>
                      Close
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Airline</h4>
                    <p>{selectedFlight.airline || "Unknown"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Origin Country</h4>
                    <p>{selectedFlight.origin_country}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p>{selectedFlight.on_ground ? "On Ground" : "In Air"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Altitude</h4>
                    <p>{Math.round(selectedFlight.baro_altitude)} meters</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Speed</h4>
                    <p>{Math.round(selectedFlight.velocity)} m/s ({Math.round(selectedFlight.velocity * 3.6)} km/h)</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Heading</h4>
                    <p>{Math.round(selectedFlight.true_track)}°</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Position</h4>
                    <p>
                      {selectedFlight.latitude.toFixed(4)}, {selectedFlight.longitude.toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Vertical Rate</h4>
                    <p>{selectedFlight.vertical_rate.toFixed(1)} m/s</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                    <p>{new Date(selectedFlight.last_contact * 1000).toLocaleTimeString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Disclaimer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Flight information provided is simulated for demonstration purposes. 
              Live tracking data is provided by FlightRadar24.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FlightTracker;
