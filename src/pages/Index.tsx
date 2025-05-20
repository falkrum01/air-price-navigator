import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import FlightSearch from "@/components/FlightSearch";
import PricePrediction from "@/components/PricePrediction";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaneTakeoff, MapPin, CalendarRange, Car, Hotel, Home } from "lucide-react";

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Next Destination</h1>
          <p className="text-gray-600">Search and compare flights from hundreds of airlines</p>
        </div>

        {/* New Complete Travel Booking CTA */}
        <Card className="bg-gradient-to-r from-airblue to-blue-600 text-white mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Complete Travel Booking</CardTitle>
            <CardDescription className="text-blue-100">Book your entire trip in one place - flights, accommodations, and transportation</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1">
              <PlaneTakeoff className="h-4 w-4" />
              <span>Flights</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1">
              <Hotel className="h-4 w-4" />
              <span>Hotels</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1">
              <Home className="h-4 w-4" />
              <span>Hostels</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1">
              <Car className="h-4 w-4" />
              <span>Cabs</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="bg-white text-airblue hover:bg-white/90">
              <Link to="/travel-booking">Start Planning Your Trip</Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Flight Search</CardTitle>
              </CardHeader>
              <CardContent>
                <FlightSearch />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Price Prediction</CardTitle>
                <CardDescription>Get insights on when to book</CardDescription>
              </CardHeader>
              <CardContent>
                <PricePrediction origin="DEL" destination="BOM" />
              </CardContent>
            </Card>

            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Destinations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { city: "Goa", code: "GOI", image: "https://images.unsplash.com/photo-1587922546307-776227941871" },
                      { city: "Mumbai", code: "BOM", image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f" },
                      { city: "Delhi", code: "DEL", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5" },
                    ].map((destination) => (
                      <div key={destination.code} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                          <img
                            src={`${destination.image}?auto=format&fit=crop&w=100&h=100&q=80`}
                            alt={destination.city}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{destination.city}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {destination.code}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Explore More Destinations
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
