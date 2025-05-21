
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ArrowLeft, CheckCircle, Hotel, Home, Plane } from "lucide-react";
import Layout from "@/components/Layout";
import FlightSearch from "@/components/FlightSearch";
import HotelSearch from "@/components/HotelSearch";
import HostelSearch from "@/components/HostelSearch";
import BookingSummary from "@/components/BookingSummary";
import { useToast } from "@/hooks/use-toast";
import { useBookingContext } from "@/contexts/BookingContext";

const TravelBooking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('flights');
  const [accommodationType, setAccommodationType] = useState<'hotel' | 'hostel'>('hotel');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { booking, hasFlightBooked, hasAccommodationBooked, resetBooking } = useBookingContext();

  // Automatically move to the next tab when a selection is made
  useEffect(() => {
    if (hasFlightBooked && activeTab === 'flights') {
      setTimeout(() => {
        toast({
          title: "Flight selected!",
          description: "Now let's choose your accommodation",
        });
        setActiveTab('accommodation');
      }, 1000);
    } else if (hasAccommodationBooked && activeTab === 'accommodation') {
      setTimeout(() => {
        toast({
          title: "Accommodation selected!",
          description: "Please review your complete itinerary",
        });
        setActiveTab('summary');
      }, 1000);
    }
  }, [hasFlightBooked, hasAccommodationBooked, activeTab, toast]);

  // Function to handle flight booking completion
  const handleFlightBookingComplete = () => {
    if (!booking.flight) {
      toast({
        title: "Flight selection required",
        description: "Please select a flight before proceeding",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Flight booked!",
      description: "Your flight has been successfully booked",
    });
    
    // Redirect to home page immediately after flight booking
    navigate('/home');
  };
  
  // Function to handle complete trip planning
  const handleCompleteBooking = () => {
    if (!booking.flight) {
      toast({
        title: "Flight selection required",
        description: "Please select a flight for your trip",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Booking Confirmed",
      description: "Your complete travel itinerary is being generated",
    });
    
    // For complete trip booking, navigate to confirmation page
    setTimeout(() => navigate("/booking-confirmation"), 1500);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Plan Your Trip</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="flights" className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              <span>Flights</span>
              {hasFlightBooked && <CheckCircle className="h-3 w-3 ml-1 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger value="accommodation" className="flex items-center gap-2">
              <Hotel className="h-4 w-4" />
              <span>Accommodation</span>
              {hasAccommodationBooked && <CheckCircle className="h-3 w-3 ml-1 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Review & Confirm</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="flights" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">Select Your Flight</h2>
                  <FlightSearch />
                  
                  <div className="mt-6 flex justify-between">
                    <div></div>
                    <div className="flex space-x-3">
                      <Button 
                        onClick={() => setActiveTab('accommodation')} 
                        variant="outline"
                        disabled={!hasFlightBooked}
                      >
                        Continue to Accommodation
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={handleFlightBookingComplete}
                        className="bg-airblue hover:bg-airblue/90"
                      >
                        Book Flight Only
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accommodation" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">Choose Your Accommodation</h2>
                  
                  {!hasFlightBooked && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-4">
                      <p className="text-amber-700">You haven't selected a flight yet. Consider booking a flight first.</p>
                    </div>
                  )}
                  
                  <Tabs
                    defaultValue="hotel"
                    value={accommodationType}
                    onValueChange={(value) => setAccommodationType(value as 'hotel' | 'hostel')}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="hotel">Hotel</TabsTrigger>
                      <TabsTrigger value="hostel">Hostel</TabsTrigger>
                    </TabsList>
                    <TabsContent value="hotel">
                      <HotelSearch />
                    </TabsContent>
                    <TabsContent value="hostel">
                      <HostelSearch />
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-6 flex justify-between">
                    <Button 
                      onClick={() => setActiveTab('flights')} 
                      variant="outline"
                      className="flex items-center"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Flights
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('summary')}
                      className="bg-airblue hover:bg-airblue/90"
                      disabled={!hasAccommodationBooked}
                    >
                      Review & Confirm <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">Review & Confirm Your Booking</h2>
                  
                  {!hasFlightBooked && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-4">
                      <p className="text-red-700">You need to select a flight before confirming your booking.</p>
                    </div>
                  )}
                  
                  <BookingSummary />
                  
                  <div className="mt-6 flex justify-between">
                    <Button 
                      onClick={() => setActiveTab('transport')} 
                      variant="outline"
                      className="flex items-center"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Ground Transport
                    </Button>
                    <Button 
                      onClick={handleCompleteBooking}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={!hasFlightBooked}
                    >
                      Confirm Complete Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TravelBooking;
