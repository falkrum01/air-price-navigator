
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Check, FileText, ChevronLeft, Loader2 } from "lucide-react";
import { useBookingContext } from "@/contexts/BookingContext";
import { useToast } from "@/hooks/use-toast";
import PaymentSystem from "@/components/PaymentSystem";
import { jsPDF } from "jspdf";
// Import autoTable with dynamic import to handle CommonJS module
import autoTable from 'jspdf-autotable';

// Extend jsPDF types to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

// Type for toast options
type ToastOptions = {
  title: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success';
};

// Extend jsPDF types to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { booking, getTotalPrice, resetBooking } = useBookingContext();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showPaymentSystem, setShowPaymentSystem] = useState(true);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  
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
    setGeneratingPdf(true);
    
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Set document properties
      doc.setProperties({
        title: `Itinerary - ${bookingId}`,
        subject: 'Travel Itinerary',
        author: 'Air Price Navigator',
        keywords: 'itinerary, booking, travel',
        creator: 'Air Price Navigator'
      });
      
      // Add title and header
      doc.setFillColor(0, 96, 168); // Air Blue color
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('Air Price Navigator', 105, 20, { align: 'center' });
      doc.setFontSize(16);
      doc.text('Travel Itinerary', 105, 30, { align: 'center' });
      
      // Add booking reference
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(`Booking Reference: ${bookingId}`, 20, 50);
      doc.text(`Booking Date: ${format(new Date(), 'PPP')}`, 20, 57);
      doc.text(`Customer: ${user?.user_metadata?.full_name || user?.email || 'Valued Customer'}`, 20, 64);
      
      // Current position
      let yPos = 80;
      
      // Flight details
      if (booking.flight) {
        doc.setFontSize(16);
        doc.setTextColor(0, 96, 168);
        doc.text('Flight Details', 20, yPos);
        yPos += 10;
        
        autoTable(doc, {
          startY: yPos,
          head: [['Detail', 'Information']],
          body: [
            ['Airline', booking.flight.airline],
            ['Flight', booking.flight.id || ''],
            ['From', booking.flight.origin],
            ['To', booking.flight.destination],
            ['Date', format(new Date(booking.flight.departureDate), 'PPP')],
            ['Departure', booking.flight.departureTime || ''],
            ['Arrival', booking.flight.arrivalTime || ''],
            ['Duration', booking.flight.duration || ''],
            ['Class', booking.flight.cabinClass || 'Economy'],
            ['Price', `₹${booking.flight.price.toLocaleString('en-IN')}`]
          ],
          theme: 'striped',
          headStyles: { fillColor: [0, 96, 168] }
        });
        
        yPos = doc.lastAutoTable.finalY + 15;
      }
      
      // Hotel details
      if (booking.hotel) {
        doc.setFontSize(16);
        doc.setTextColor(0, 96, 168);
        doc.text('Hotel Details', 20, yPos);
        yPos += 10;
        
        autoTable(doc, {
          startY: yPos,
          head: [['Detail', 'Information']],
          body: [
            ['Name', booking.hotel.name],
            ['Location', booking.hotel.location],
            ['Check-in', format(new Date(booking.hotel.checkIn), 'PPP')],
            ['Check-out', format(new Date(booking.hotel.checkOut), 'PPP')],
            ['Room Type', booking.hotel.roomType],
            ['Guests', booking.hotel.guestCount.toString()],
            ['Price per Night', `₹${booking.hotel.pricePerNight.toLocaleString('en-IN')}`],
            ['Total Price', `₹${booking.hotel.totalPrice.toLocaleString('en-IN')}`]
          ],
          theme: 'striped',
          headStyles: { fillColor: [0, 96, 168] }
        });
        
        yPos = doc.lastAutoTable.finalY + 15;
      }
      
      // Hostel details
      if (booking.hostel) {
        doc.setFontSize(16);
        doc.setTextColor(0, 96, 168);
        doc.text('Hostel Details', 20, yPos);
        yPos += 10;
        
        autoTable(doc, {
          startY: yPos,
          head: [['Detail', 'Information']],
          body: [
            ['Name', booking.hostel.name],
            ['Location', booking.hostel.location],
            ['Check-in', format(new Date(booking.hostel.checkIn), 'PPP')],
            ['Check-out', format(new Date(booking.hostel.checkOut), 'PPP')],
            ['Bed Type', booking.hostel.bedType || 'Standard'],
            ['Guests', booking.hostel.guestCount.toString()],
            ['Price per Night', `₹${booking.hostel.pricePerNight.toLocaleString('en-IN')}`],
            ['Total Price', `₹${booking.hostel.totalPrice.toLocaleString('en-IN')}`]
          ],
          theme: 'striped',
          headStyles: { fillColor: [0, 96, 168] }
        });
        
        yPos = doc.lastAutoTable.finalY + 15;
      }
      
      // Cab details
      if (booking.cab) {
        doc.setFontSize(16);
        doc.setTextColor(0, 96, 168);
        doc.text('Ground Transport Details', 20, yPos);
        yPos += 10;
        
        autoTable(doc, {
          startY: yPos,
          head: [['Detail', 'Information']],
          body: [
            ['Type', `${booking.cab.type} Cab`],
            ['Pickup Location', booking.cab.pickupLocation],
            ['Dropoff Location', booking.cab.dropoffLocation],
            ['Pickup Time', format(new Date(booking.cab.pickupTime), 'PPP p')],
            ['Distance', booking.cab.distance],
            ['Estimated Time', booking.cab.estimatedTime],
            ['Price', `₹${booking.cab.price.toLocaleString('en-IN')}`]
          ],
          theme: 'striped',
          headStyles: { fillColor: [0, 96, 168] }
        });
        
        yPos = doc.lastAutoTable.finalY + 15;
      }
      
      // Payment Summary
      doc.setFontSize(16);
      doc.setTextColor(0, 96, 168);
      doc.text('Payment Summary', 20, yPos);
      yPos += 10;
      
      const paymentRows = [];
      if (booking.flight) {
        paymentRows.push(['Flight', `₹${booking.flight.price.toLocaleString('en-IN')}`]);
      }
      
      if (booking.hotel) {
        paymentRows.push(['Hotel', `₹${booking.hotel.totalPrice.toLocaleString('en-IN')}`]);
      }
      
      if (booking.hostel) {
        paymentRows.push(['Hostel', `₹${booking.hostel.totalPrice.toLocaleString('en-IN')}`]);
      }
      
      if (booking.cab) {
        paymentRows.push(['Ground Transport', `₹${booking.cab.price.toLocaleString('en-IN')}`]);
      }
      
      const totalAmount = getTotalPrice();
      const taxes = Math.round(totalAmount * 0.18); // 18% tax
      const finalAmount = totalAmount + taxes;
      
      paymentRows.push(['Subtotal', `₹${totalAmount.toLocaleString('en-IN')}`]);
      paymentRows.push(['Taxes & Fees (18%)', `₹${taxes.toLocaleString('en-IN')}`]);
      
      autoTable(doc, {
        startY: yPos,
        body: paymentRows,
        theme: 'plain',
        styles: { fontSize: 10 },
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { halign: 'right' }
        },
        foot: [['Total Amount', `₹${finalAmount.toLocaleString('en-IN')}`]],
        footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' }
      });
      
      // Add footer
      yPos = doc.lastAutoTable.finalY + 20;
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Thank you for booking with Air Price Navigator!', 105, yPos, { align: 'center' });
      doc.text('For assistance, contact support@airpricenavigator.com', 105, yPos + 5, { align: 'center' });
      doc.text(`Generated on ${format(new Date(), 'PPP p')}`, 105, yPos + 10, { align: 'center' });
      
      // Save the PDF
      doc.save(`AirPriceNavigator_Itinerary_${bookingId}.pdf`);
      
      toast({
        title: "PDF Downloaded",
        description: "Your travel itinerary has been successfully downloaded.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error Downloading PDF",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGeneratingPdf(false);
    }
  };
  
  const handlePaymentComplete = () => {
    setShowPaymentSystem(false);
    setPaymentCompleted(true);
  };
  
  const handlePaymentCancel = () => {
    // Go back to travel booking page
    navigate('/travel-booking');
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {showPaymentSystem ? (
          <PaymentSystem 
            onPaymentComplete={handlePaymentComplete}
            onCancel={handlePaymentCancel}
          />
        ) : (
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
                      <div className="mt-2 text-center text-green-600 text-sm font-medium">
                        Payment Completed Successfully
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleDownloadPDF}
                    disabled={generatingPdf}
                  >
                    {generatingPdf ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        Download Itinerary
                      </>
                    )}
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
        )}
      </div>
    </Layout>
  );
};

export default BookingConfirmation;
