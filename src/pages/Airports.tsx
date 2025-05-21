import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Plane } from "lucide-react";

const Airports: React.FC = () => {
  const openFlightRadar = () => {
    window.open('https://www.flightradar24.com', '_blank');
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Airports Information</CardTitle>
                <CardDescription>Find information about airports worldwide</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openFlightRadar}
                title="Open FlightRadar24"
                className="ml-2"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                FlightRadar24
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Plane className="h-12 w-12 mx-auto text-airblue mb-3" />
                <p className="text-gray-600">Airport information will be displayed here</p>
                <p className="text-sm text-gray-500 mt-2">
                  Search for an airport to view details, weather, and flights
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={openFlightRadar}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View on FlightRadar24
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Airports;
