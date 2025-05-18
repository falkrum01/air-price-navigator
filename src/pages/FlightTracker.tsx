import React, { useState, useEffect, useCallback } from "react";
import { Plane, RefreshCw, Search, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  baro_altitude: number;
  on_ground: boolean;
  velocity: number;
  true_track: number;
  vertical_rate: number;
  sensors?: number[];
  geo_altitude?: number;
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

  // Function to get airline name from ICAO24 address
  const getAirlineFromIcao24 = (icao24: string): string => {
    // This is a simplified mapping - in a real app, you'd want a more comprehensive mapping
    const airlinePrefixes: Record<string, string> = {
      '8008': 'IndiGo',
      '8009': 'Air India',
      '8010': 'SpiceJet',
      '8011': 'Vistara',
      '8960': 'Emirates',
      '8961': 'Qatar Airways',
      '8962': 'Singapore Airlines',
      '8963': 'British Airways',
      '8964': 'Lufthansa',
    };
    
    const prefix = icao24.substring(0, 4);
    return airlinePrefixes[prefix] || 'Unknown Airline';
  };

  // Generate mock flight data for fallback
  const generateMockFlights = (): Flight[] => {
    const countries = ["India", "UAE", "USA", "UK", "Singapore", "Thailand", "China", "Japan", "Australia", "Germany"];
    const airlines = ["Air India", "IndiGo", "SpiceJet", "Vistara", "Emirates", "Singapore Airlines", "British Airways", "Delta", "Qantas"];
    
    return Array(200)
      .fill(null)
      .map((_, index) => {
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        const randomAirline = airlines[Math.floor(Math.random() * airlines.length)];
        const isOnGround = Math.random() > 0.7;
        const lat = 8 + Math.random() * 30; // Roughly India region
        const lon = 70 + Math.random() * 25;
        const altitude = isOnGround ? 0 : 5000 + Math.random() * 35000;
        const velocity = isOnGround ? 0 : 200 + Math.random() * 500;
        const callsign = `${randomAirline.substring(0, 2).toUpperCase()}${100 + Math.floor(Math.random() * 900)}`;
        
        return {
          icao24: `8${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          callsign,
          origin_country: randomCountry,
          time_position: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 3600),
          last_contact: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 60),
          longitude: lon,
          latitude: lat,
          baro_altitude: altitude,
          on_ground: isOnGround,
          velocity,
          true_track: Math.random() * 360,
          vertical_rate: isOnGround ? 0 : (Math.random() > 0.5 ? 1 : -1) * Math.random() * 10,
          sensors: [],
          geo_altitude: altitude,
          squawk: Math.floor(1000 + Math.random() * 9000).toString(),
          spi: false,
          position_source: 0,
          airline: randomAirline
        };
      });
  };

  // Function to fetch flights from API or use mock data
  const fetchFlights = useCallback(async () => {
    setLoading(true);
    try {
      // For demo purposes, we'll use mock data
      // In a real app, you would fetch from an API
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
  }, []);

  // Filter flights based on search term and country
  useEffect(() => {
    let filtered = [...flights];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(flight => 
        flight.callsign.toLowerCase().includes(term) || 
        flight.airline?.toLowerCase().includes(term) ||
        flight.origin_country.toLowerCase().includes(term)
      );
    }
    
    if (countryFilter !== "all") {
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
  }, [fetchFlights]);

  // Get unique countries for the filter
  const countries = [...new Set(flights.map(flight => flight.origin_country))].sort();

  // Handle flight selection
  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
  };

  // Open FlightRadar24 website
  const openFlightMap = () => {
    window.open("https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.flightradar24.com/&ved=2ahUKEwjJ9uOTgK2NAxWQR2wGHYtfKesQFnoECAoQAQ&usg=AOvVaw3Kl8F_pSsWPVMsjJu5YYM7", '_blank');
  };
  
  // Open specific flight details on FlightRadar24
  const openFlightDetails = () => {
    if (selectedFlight) {
      const flightId = selectedFlight.callsign?.trim() || selectedFlight.icao24;
      window.open(`https://www.flightradar24.com/${flightId}`, '_blank');
    }
  };

  // Format altitude from meters to feet
  const formatAltitude = (meters: number): string => {
    return meters ? `${Math.round(meters * 3.28084).toLocaleString()} ft` : 'N/A';
  };

  // Format speed from m/s to km/h
  const formatSpeed = (mps: number): string => {
    return mps ? `${Math.round(mps * 3.6)} km/h` : 'N/A';
  };

  // Format a timestamp from Unix time
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-4">
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center">
            <Plane className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-blue-500 flex-shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold">Flight Tracker</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchFlights}
              disabled={loading}
              className="flex-1 sm:flex-none justify-center"
            >
              <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-xs sm:text-sm">Refresh</span>
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={openFlightMap}
              className="flex-1 sm:flex-none justify-center"
            >
              <ExternalLink className="h-4 w-4 mr-1.5" />
              <span className="text-xs sm:text-sm">FlightRadar24</span>
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
          <div className="text-xs sm:text-sm text-gray-500 mb-2">
            Last updated: {dataTimestamp.toLocaleTimeString()}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by callsign, airline..."
                className="pl-8 text-sm sm:text-base h-10 sm:h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                  <SelectValue placeholder="Filter by country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end sm:col-span-2 lg:col-span-1">
              <div className="bg-white px-3 py-1.5 rounded-md flex items-center flex-wrap justify-center sm:justify-end gap-1.5 text-xs sm:text-sm">
                <span className="whitespace-nowrap">Showing:</span>
                <Badge variant="outline" className="h-5 sm:h-6">{filteredFlights.length}</Badge>
                <span>of</span>
                <Badge variant="outline" className="h-5 sm:h-6">{flights.length}</Badge>
                <span className="whitespace-nowrap">flights</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          {/* Flight list */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <Card className="h-[50vh] sm:h-[65vh] overflow-hidden flex flex-col">
              <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                <CardTitle className="text-base sm:text-lg">Flight List</CardTitle>
              </CardHeader>
              <div className="overflow-y-auto flex-grow -mt-1">
                {filteredFlights.length > 0 ? (
                  <div className="divide-y">
                    {filteredFlights.map((flight) => (
                      <div
                        key={flight.icao24}
                        className={`p-2 sm:p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedFlight?.icao24 === flight.icao24 ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => handleSelectFlight(flight)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-sm sm:text-base truncate max-w-[60%]">
                            {flight.callsign || 'N/A'}
                          </div>
                          <Badge 
                            variant={flight.on_ground ? "outline" : "default"}
                            className="text-xs sm:text-sm h-5 sm:h-6"
                          >
                            {flight.on_ground ? "Ground" : "Air"}
                          </Badge>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                          <span className="truncate">{flight.airline || 'Unknown'}</span>
                          <span className="mx-1.5">•</span>
                          <span className="truncate">{flight.origin_country}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm sm:text-base">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Loading flights...
                      </div>
                    ) : (
                      "No flights found matching your criteria"
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          {/* Flight Details */}
          <div className="flex-1">
            <Card className="h-[50vh] sm:h-[65vh] overflow-hidden">
              <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                <CardTitle className="text-base sm:text-lg">Flight Details</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {selectedFlight ? (
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold">{selectedFlight.callsign || 'N/A'}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedFlight.airline} • {selectedFlight.origin_country}
                        </p>
                      </div>
                      <Badge 
                        variant={selectedFlight.on_ground ? "outline" : "default"}
                        className="text-xs sm:text-sm px-2.5 py-1 sm:px-3 sm:py-1.5"
                      >
                        {selectedFlight.on_ground ? "On Ground" : "In Air"}
                      </Badge>
                    </div>
                    <Separator className="my-3 sm:my-4" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      <div className="border rounded-md p-2">
                        <div className="text-[10px] xs:text-xs text-gray-500">Altitude</div>
                        <div className="font-medium text-sm sm:text-base">
                          {formatAltitude(selectedFlight.baro_altitude)}
                        </div>
                      </div>
                      <div className="border rounded-md p-2">
                        <div className="text-[10px] xs:text-xs text-gray-500">Speed</div>
                        <div className="font-medium text-sm sm:text-base">
                          {formatSpeed(selectedFlight.velocity)}
                        </div>
                      </div>
                      <div className="border rounded-md p-2">
                        <div className="text-[10px] xs:text-xs text-gray-500">Heading</div>
                        <div className="font-medium text-sm sm:text-base">
                          {Math.round(selectedFlight.true_track)}°
                        </div>
                      </div>
                      <div className="border rounded-md p-2">
                        <div className="text-[10px] xs:text-xs text-gray-500">Vertical Rate</div>
                        <div className="font-medium text-sm sm:text-base">
                          {selectedFlight.vertical_rate.toFixed(1)} m/s
                        </div>
                      </div>
                      <div className="border rounded-md p-2">
                        <div className="text-[10px] xs:text-xs text-gray-500">Position</div>
                        <div className="font-medium text-[10px] xs:text-xs">
                          {selectedFlight.latitude.toFixed(4)}, {selectedFlight.longitude.toFixed(4)}
                        </div>
                      </div>
                      <div className="border rounded-md p-2">
                        <div className="text-[10px] xs:text-xs text-gray-500">Last Contact</div>
                        <div className="font-medium text-sm sm:text-base">
                          {formatTimestamp(selectedFlight.last_contact)}
                        </div>
                      </div>
                      {selectedFlight.squawk && (
                        <div className="border rounded-md p-2">
                          <div className="text-[10px] xs:text-xs text-gray-500">Squawk</div>
                          <div className="font-medium text-sm sm:text-base">{selectedFlight.squawk}</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 sm:mt-6 text-center">
                      <Button 
                        variant="default" 
                        onClick={openFlightDetails}
                        className="w-full sm:w-auto h-9 sm:h-10 text-sm sm:text-base"
                      >
                        <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                        Track on FlightRadar24
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-6 sm:p-8">
                      <Plane className="mx-auto h-14 sm:h-16 w-14 sm:w-16 text-blue-500 mb-3 sm:mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">Live Flight Tracking</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Select a flight to view detailed information
                      </p>
                      <Button 
                        variant="default" 
                        onClick={openFlightMap}
                        className="mt-2"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open FlightRadar24
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        Flight data provided by FlightRadar24
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-4">
          Flight information provided is for demonstration purposes.
          For accurate tracking, please visit <a href="https://www.flightradar24.com" target="_blank" rel="noopener noreferrer" className="underline">FlightRadar24</a>.
        </div>
      </div>
    </div>
  );
};

export default FlightTracker;
