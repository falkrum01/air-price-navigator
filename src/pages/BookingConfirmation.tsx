
import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Check, FileText, ChevronLeft } from "lucide-react";
import { useBookingContext } from "@/contexts/BookingContext";
import { useToast } from "@/hooks/use-toast";

const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { booking, getTotalPrice, resetBooking } = useBookingContext();
  const { toast } = useToast();
  
  // Generate a random booking ID
  const bookingId = React.useMemo(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }, []);
  
  useEffect(() => {
    // Check if there's any booking
    const hasBooking = booking.flight || booking.hotel || booking.hostel || booking.cab;
    
    if (!hasBooking) {
      toast({
        title: "No booking found",
        description: "You haven't made any booking yet.",
        variant: "destructive",
      });
      navigate('/home');
    }
  }, [booking, navigate, toast]);

  const handleStartNewBooking = () => {
    resetBooking();
    navigate('/travel-booking');
  };
  
  const handleDownloadPDF = () => {
    toast({
      title: "Downloading PDF",
      description: "Your travel itinerary is being downloaded.",
    });
    // In a real app, this would download the actual PDF
  };
  
  const handleEmailItinerary = () => {
    toast({
      title: "Email sent",
      description: "Your travel itinerary has been sent to your email.",
    });
    // In a real app, this would send an email with the itinerary
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
              <p className="text-xl">Thank you for your booking</p>
              <p className="text-muted-foreground mt-2">Booking Reference: <span className="font-semibold">{bookingId}</span></p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-muted p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
                
                <div className="space-y-4">
                  {booking.flight && (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Flight</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.flight.airline} - {booking.flight.origin} to {booking.flight.destination}
                        </p>
                      </div>
                      <p className="font-medium">₹{booking.flight.price.toLocaleString()}</p>
                    </div>
                  )}
                  
                  {booking.hotel && (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Hotel</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.hotel.name}, {booking.hotel.location}
                        </p>
                      </div>
                      <p className="font-medium">₹{booking.hotel.totalPrice.toLocaleString()}</p>
                    </div>
                  )}
                  
                  {booking.hostel && (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Hostel</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.hostel.name}, {booking.hostel.location}
                        </p>
                      </div>
                      <p className="font-medium">₹{booking.hostel.totalPrice.toLocaleString()}</p>
                    </div>
                  )}
                  
                  {booking.cab && (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Ground Transport</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.cab.type} cab - {booking.cab.pickupLocation} to {booking.cab.dropoffLocation}
                        </p>
                      </div>
                      <p className="font-medium">₹{booking.cab.price.toLocaleString()}</p>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center font-semibold">
                      <p>Total Amount</p>
                      <p className="text-xl text-airblue">₹{getTotalPrice().toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleDownloadPDF}
                >
                  <FileText className="h-4 w-4" />
                  Download Itinerary
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleEmailItinerary}
                >
                  Email Itinerary
                </Button>
              </div>
              
              <div className="border-t pt-6 mt-6 flex flex-col sm:flex-row justify-between gap-4">
                <Button 
                  variant="ghost" 
                  className="flex items-center"
                  onClick={() => navigate('/home')}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                
                <Button 
                  className="bg-airblue hover:bg-airblue/90"
                  onClick={handleStartNewBooking}
                >
                  Book Another Trip
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BookingConfirmation;
