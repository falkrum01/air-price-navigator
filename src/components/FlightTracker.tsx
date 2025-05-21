import React, { useState, useCallback } from 'react';

// Flight data interface
interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
}
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plane, Clock, Calendar, ExternalLink } from 'lucide-react';

// Helper components
const FlightMap: React.FC<{ flight: Flight }> = ({ flight }) => {
  return (
    <div className="h-64 bg-gray-100 rounded-lg p-4">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="font-medium">{flight.departure} → {flight.arrival}</h3>
          <p className="text-sm text-gray-500">{flight.airline} {flight.flightNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">Status: <span className="text-green-600">{flight.status}</span></p>
        </div>
      </div>
      <div className="h-40 bg-gray-200 rounded flex items-center justify-center">
        <p className="text-gray-600">Flight path visualization would appear here</p>
      </div>
    </div>
  );
};

const FlightDetails: React.FC<{ flight: Flight }> = ({ flight }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium mb-2">Departure</h3>
          <p className="text-2xl font-bold">{flight.departure}</p>
          <p className="text-gray-500">{flight.departureTime}</p>
        </div>
        <div>
          <h3 className="font-medium mb-2">Arrival</h3>
          <p className="text-2xl font-bold">{flight.arrival}</p>
          <p className="text-gray-500">{flight.arrivalTime}</p>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="font-medium mb-2">Flight Information</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-500">Airline:</span> {flight.airline}</div>
          <div><span className="text-gray-500">Flight Number:</span> {flight.flightNumber}</div>
          <div><span className="text-gray-500">Status:</span> {flight.status}</div>
          <div><span className="text-gray-500">Duration:</span> 2h 30m</div>
          <div><span className="text-gray-500">Aircraft:</span> Airbus A320</div>
          <div><span className="text-gray-500">Terminal:</span> T3</div>
        </div>
      </div>
    </div>
  );
};

const PriceTrendChart: React.FC<{ flight: Flight }> = ({ flight }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Price History for {flight.departure} → {flight.arrival}</h3>
        <p className="text-sm text-gray-500">Last updated: Today</p>
      </div>
      
      <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">Price trend chart would appear here</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center pt-2">
        <div>
          <p className="text-sm text-gray-500">Current Price</p>
          <p className="font-bold text-green-600">₹5,450</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Average Price</p>
          <p className="font-bold">₹6,200</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Price Prediction</p>
          <p className="font-bold text-red-600">↑ Rising</p>
        </div>
      </div>
    </div>
  );
};

const FlightTracker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const { toast } = useToast();
  
  // Mock flight data
  const mockFlights: Flight[] = [
    {
      id: "f1",
      flightNumber: "AI203",
      airline: "Air India",
      departure: "DEL",
      arrival: "HYD",
      departureTime: "10:30 AM",
      arrivalTime: "12:30 PM",
      status: "On Time"
    },
    {
      id: "f2",
      flightNumber: "6E302",
      airline: "IndiGo",
      departure: "BOM",
      arrival: "DEL",
      departureTime: "11:45 AM",
      arrivalTime: "1:45 PM",
      status: "Delayed"
    },
    {
      id: "f3",
      flightNumber: "UK835",
      airline: "Vistara",
      departure: "BLR",
      arrival: "DEL",
      departureTime: "9:15 AM",
      arrivalTime: "11:45 AM",
      status: "In Air"
    }
  ];
  
  const handleSearch = useCallback(() => {
    if (!searchQuery) {
      toast({
        title: "Please enter a search query",
        description: "Enter a flight number, route, or airport code",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate search delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Search completed",
        description: `Found results for "${searchQuery}"`,
      });
    }, 1000);
  }, [searchQuery, toast]);
  
  const openFlightRadar = useCallback((flightNumber?: string) => {
    const url = flightNumber 
      ? `https://www.flightradar24.com/data/flights/${flightNumber.toLowerCase()}`
      : 'https://www.flightradar24.com';
    
    window.open(url, '_blank');
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Flight Tracker</CardTitle>
              <CardDescription>Track flights in real-time and view price trends</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => openFlightRadar()}
              title="Open FlightRadar24"
              className="ml-2"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              FlightRadar24
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <Input
                placeholder="Search by flight number, airline, or airport code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSearch} 
                className="bg-airblue hover:bg-airblue/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Plane className="mr-2 h-4 w-4" />
                    Search Flights
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => openFlightRadar()}
                title="Open FlightRadar24"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Sample flight results */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Available Flights</h3>
            <div className="space-y-3">
              {mockFlights.map(flight => (
                <Card 
                  key={flight.id} 
                  className="hover:border-airblue transition-colors cursor-pointer"
                  onClick={() => setSelectedFlight(flight)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{flight.flightNumber}</span>
                          <span className="text-gray-500">• {flight.airline}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-medium">{flight.departure}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-medium">{flight.arrival}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>{flight.departureTime} - {flight.arrivalTime}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              openFlightRadar(flight.flightNumber);
                            }}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Track on FlightRadar24
                          </Button>
                          <Button 
                            size="sm" 
                            variant="default"
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFlight(flight);
                            }}
                          >
                            Select Flight
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Tabs for flight details */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="map">Live Map</TabsTrigger>
              <TabsTrigger value="details">Flight Details</TabsTrigger>
              <TabsTrigger value="price">Price Trends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="map" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Plane className="h-12 w-12 mx-auto text-airblue mb-3" />
                      <p className="text-gray-600">Flight map will be displayed here</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Select a flight to view real-time tracking
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => openFlightRadar()}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View on FlightRadar24
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center py-8">
                    <p className="text-gray-600">Select a flight to view details</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="price" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center py-8">
                    <p className="text-gray-600">Select a flight to view price trends</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Price data is sourced from historical flight information
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlightTracker;
