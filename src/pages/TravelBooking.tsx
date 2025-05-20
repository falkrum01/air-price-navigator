
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ArrowLeft, CheckCircle, Hotel, Home, Car, Plane } from "lucide-react";
import Layout from "@/components/Layout";
import FlightSearch from "@/components/FlightSearch";
import HotelSearch from "@/components/HotelSearch";
import HostelSearch from "@/components/HostelSearch";
import CabSearch from "@/components/CabSearch";
import BookingSummary from "@/components/BookingSummary";
import { useToast } from "@/hooks/use-toast";
import { useBookingContext } from "@/contexts/BookingContext";

const STEPS = [
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'accommodation', label: 'Accommodation', icon: Hotel },
  { id: 'transport', label: 'Ground Transport', icon: Car },
  { id: 'summary', label: 'Review & Confirm', icon: CheckCircle }
];

const TravelBooking: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<string>('flights');
  const [accommodationType, setAccommodationType] = useState<'hotel' | 'hostel'>('hotel');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { booking, hasFlightBooked } = useBookingContext();

  const handleNext = () => {
    const currentIndex = STEPS.findIndex(step => step.id === currentStep);
    
    if (currentStep === 'flights' && !hasFlightBooked) {
      toast({
        title: "Flight selection required",
        description: "Please select a flight before proceeding to accommodation",
        variant: "destructive",
      });
      return;
    }
    
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    const currentIndex = STEPS.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id);
      window.scrollTo(0, 0);
    }
  };

  const handleSkip = () => {
    const currentIndex = STEPS.findIndex(step => step.id === currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id);
      window.scrollTo(0, 0);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Complete Travel Booking</h1>
        
        {/* Progress Indicator */}
        <div className="mb-10">
          <div className="flex justify-between items-center">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isPast = STEPS.findIndex(s => s.id === currentStep) > index;
              
              return (
                <React.Fragment key={step.id}>
                  {index > 0 && (
                    <div className={`h-1 flex-1 ${isPast ? 'bg-airblue' : 'bg-gray-200'}`} />
                  )}
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white
                        ${isActive ? 'bg-airblue' : isPast ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <StepIcon size={20} />
                    </div>
                    <span className={`mt-2 text-sm font-medium ${isActive ? 'text-airblue' : ''}`}>
                      {step.label}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            {currentStep === 'flights' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Select Your Flight</h2>
                <FlightSearch />
              </div>
            )}

            {currentStep === 'accommodation' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Choose Your Accommodation</h2>
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
              </div>
            )}

            {currentStep === 'transport' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Book Ground Transportation</h2>
                <CabSearch />
              </div>
            )}

            {currentStep === 'summary' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Review Your Booking</h2>
                <BookingSummary />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentStep !== 'flights' ? (
            <Button 
              onClick={handleBack}
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          ) : (
            <div></div> // Empty div to maintain flex spacing
          )}
          
          <div className="flex space-x-3">
            {currentStep !== 'summary' && currentStep !== 'flights' && (
              <Button 
                onClick={handleSkip}
                variant="ghost"
              >
                Skip this step
              </Button>
            )}
            
            {currentStep !== 'summary' ? (
              <Button 
                onClick={handleNext}
                className="flex items-center bg-airblue hover:bg-airblue/90"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  toast({
                    title: "Booking Confirmed",
                    description: "Your travel itinerary is being generated",
                  });
                  // In a real app, this would trigger PDF generation
                  setTimeout(() => navigate("/booking-confirmation"), 1500);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Confirm Booking
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TravelBooking;
