import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, LineChart } from "lucide-react";

const PriceTrends: React.FC = () => {
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
                <CardTitle>Price Trends</CardTitle>
                <CardDescription>Track and analyze flight price trends over time</CardDescription>
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
                <LineChart className="h-12 w-12 mx-auto text-airblue mb-3" />
                <p className="text-gray-600">Price trend charts will be displayed here</p>
                <p className="text-sm text-gray-500 mt-2">
                  Select routes and dates to view price predictions
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

export default PriceTrends;
