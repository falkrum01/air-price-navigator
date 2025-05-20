
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Plane, Calendar, MapPin, CreditCard, IndianRupee, Banknote, Wallet, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface PaymentFormProps {
  flightDetails: {
    airline: string;
    flightNumber: string;
    price: number;
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
    cabinClass: string;
    departureTime?: string;
    arrivalTime?: string;
    duration?: string;
  };
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ flightDetails, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [walletProvider, setWalletProvider] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalAmount = flightDetails.price * flightDetails.passengers;
  const taxes = Math.round(totalAmount * 0.18);
  const finalAmount = totalAmount + taxes;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePaymentDetails()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Generate a random transaction ID
      const transactionId = `TXN${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;
      
      // Calculate amounts
      const baseFare = flightDetails.price * flightDetails.passengers;
      const taxes = Math.round(baseFare * 0.18);
      const finalAmount = baseFare + taxes;
      
      // Prepare booking data
      const bookingData = {
        user_id: user?.id,
        origin: flightDetails.origin,
        destination: flightDetails.destination,
        departure_date: flightDetails.departureDate,
        return_date: flightDetails.returnDate || null,
        airline: flightDetails.airline,
        flight_number: flightDetails.flightNumber,
        price: finalAmount,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        booking_status: 'confirmed'
      };
      
      // Add cabin_class and passenger_count if they exist in the schema
      if (flightDetails.cabinClass) {
        (bookingData as any).cabin_class = flightDetails.cabinClass;
      }
      
      if (flightDetails.passengers) {
        (bookingData as any).passenger_count = flightDetails.passengers;
      }
      
      // Save the booking to the database
      const { error } = await supabase.from('bookings').insert(bookingData);
      
      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Payment failed: ${error.message}`);
      }
      
      // Generate PDF ticket
      generatePDF(transactionId);
      
      // Show success message
      toast({
        title: "Payment Successful",
        description: "Your flight has been booked successfully! Check your email for details.",
        variant: "default",
      });
      
      // Simulate sending email
      sendConfirmationEmail(transactionId);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePaymentDetails = () => {
    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        toast({
          title: "Invalid Card Number",
          description: "Please enter a valid 16-digit card number.",
          variant: "destructive",
        });
        return false;
      }
      
      if (!cardName) {
        toast({
          title: "Missing Information",
          description: "Please enter the cardholder name.",
          variant: "destructive",
        });
        return false;
      }
      
      if (!cardExpiry || !cardExpiry.match(/^\d{2}\/\d{2}$/)) {
        toast({
          title: "Invalid Expiry Date",
          description: "Please enter a valid expiry date (MM/YY).",
          variant: "destructive",
        });
        return false;
      }
      
      if (!cardCvv || cardCvv.length !== 3) {
        toast({
          title: "Invalid CVV",
          description: "Please enter a valid 3-digit CVV.",
          variant: "destructive",
        });
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        toast({
          title: "Invalid UPI ID",
          description: "Please enter a valid UPI ID.",
          variant: "destructive",
        });
        return false;
      }
    } else if (paymentMethod === 'wallet') {
      if (!walletProvider) {
        toast({
          title: "Missing Information",
          description: "Please select a wallet provider.",
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };

  const generatePDF = (transactionId: string) => {
    const doc = new jsPDF();
    const pnr = `PNR${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    const ticketNumber = `TK${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`;
    const gate = String.fromCharCode(65 + Math.floor(Math.random() * 10)) + (Math.floor(Math.random() * 20) + 1);
    const seat = (Math.floor(Math.random() * 30) + 1) + String.fromCharCode(65 + Math.floor(Math.random() * 6));
    const terminal = Math.floor(Math.random() * 3) + 1;
    const baggageAllowance = flightDetails.cabinClass === 'economy' ? '15kg' : flightDetails.cabinClass === 'business' ? '30kg' : '40kg';
    
    // Add Airline Header
    doc.setFillColor(10, 61, 98);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text(flightDetails.airline, 20, 25);
    doc.setFontSize(12);
    doc.text("E-TICKET / ITINERARY / RECEIPT", 120, 20);
    doc.text("BOARDING PASS", 120, 30);
    
    // Add PNR and Ticket Number
    doc.setFontSize(10);
    doc.text(`PNR: ${pnr}`, 20, 50);
    doc.text(`E-Ticket Number: ${ticketNumber}`, 20, 57);
    doc.text(`Booking Ref: ${transactionId}`, 20, 64);
    doc.text(`Status: CONFIRMED`, 120, 50);
    doc.text(`Issued On: ${format(new Date(), "dd MMM yyyy")}`, 120, 57);
    
    // Passenger Information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(230, 230, 230);
    doc.rect(20, 70, 170, 10, 'F');
    doc.text("PASSENGER INFORMATION", 22, 77);
    
    doc.setFontSize(10);
    doc.text(`Passenger: ${user?.user_metadata?.full_name || 'Passenger Name'}`, 22, 90);
    doc.text(`Class: ${flightDetails.cabinClass.toUpperCase()}`, 22, 97);
    doc.text(`Seat: ${seat}`, 120, 90);
    doc.text(`Baggage: ${baggageAllowance}`, 120, 97);
    
    // Flight Details
    doc.setFontSize(12);
    doc.setFillColor(230, 230, 230);
    doc.rect(20, 105, 170, 10, 'F');
    doc.text("FLIGHT DETAILS", 22, 112);
    
    // Flight segment
    doc.setFontSize(10);
    doc.text(`${flightDetails.origin} → ${flightDetails.destination}`, 22, 125);
    doc.text(`Flight: ${flightDetails.airline} ${flightDetails.flightNumber}`, 22, 132);
    doc.text(`Date: ${format(new Date(flightDetails.departureDate), "dd MMM yyyy")}`, 22, 139);
    doc.text(`Departure: ${flightDetails.departureTime || '--:--'}`, 22, 146);
    doc.text(`Arrival: ${flightDetails.arrivalTime || '--:--'}`, 22, 153);
    doc.text(`Duration: ${flightDetails.duration || '--h --m'}`, 100, 125);
    doc.text(`Gate: ${gate}`, 100, 132);
    doc.text(`Terminal: ${terminal}`, 100, 139);
    
    // Payment Information
    doc.setFontSize(12);
    doc.setFillColor(230, 230, 230);
    doc.rect(20, 160, 170, 10, 'F');
    doc.text("PAYMENT DETAILS", 22, 167);
    
    const baseFare = flightDetails.price * flightDetails.passengers;
    const taxes = Math.round(baseFare * 0.18);
    const finalAmount = baseFare + taxes;
    
    doc.setFontSize(10);
    doc.text(`Base Fare (${flightDetails.passengers} x ₹${flightDetails.price.toLocaleString()}):`, 22, 180);
    doc.text(`₹${baseFare.toLocaleString()}`, 160, 180, { align: 'right' } as any);
    
    doc.text(`Taxes & Fees:`, 22, 187);
    doc.text(`₹${taxes.toLocaleString()}`, 160, 187, { align: 'right' } as any);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount:`, 22, 197);
    doc.text(`₹${finalAmount.toLocaleString()}`, 160, 197, { align: 'right' } as any);
    doc.setFont('helvetica', 'normal');
    
    // Barcode and Important Information
    doc.setFontSize(10);
    doc.text(`Payment Method: ${paymentMethod.toUpperCase()}`, 22, 210);
    doc.text(`Status: PAID`, 22, 217);
    
    // Add a simple barcode (as a placeholder)
    doc.setFillColor(0, 0, 0);
    for (let i = 0; i < 20; i++) {
      const barHeight = 5 + Math.random() * 5;
      doc.rect(100 + (i * 3), 215, 2, barHeight, 'F');
    }
    
    // Add important notes
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("IMPORTANT: Please bring this e-ticket and a valid photo ID to the airport.", 22, 235);
    doc.text(`Check-in opens 48 hours before departure and closes 60 minutes before departure.`, 22, 240);
    doc.text(`For assistance, contact SkyPredict Support at support@skypredict.com or call +91 1234567890.`, 22, 245);
    
    // Add footer
    doc.setFontSize(7);
    doc.text(" 2025 SkyPredict. All rights reserved.", 105, 290, { align: 'center' } as any);
    
    // Save the PDF with a meaningful name
    doc.save(`SkyPredict_Ticket_${pnr}.pdf`);
  };

  const sendConfirmationEmail = (transactionId: string) => {
    // In a real application, this would call an API endpoint to send an email
    console.log("Sending confirmation email for booking:", transactionId);
    
    setTimeout(() => {
      toast({
        title: "Confirmation Email Sent",
        description: `A confirmation email has been sent to ${user?.email || 'your email address'}`,
      });
    }, 1000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatCardNumber(value);
    setCardNumber(formattedValue);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      let formattedValue = value;
      if (value.length > 2) {
        formattedValue = value.slice(0, 2) + '/' + value.slice(2);
      }
      setCardExpiry(formattedValue);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Complete your booking by making payment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="font-medium flex items-center">
                  <Plane className="h-4 w-4 mr-2" />
                  Flight
                </span>
                <span>{flightDetails.airline} {flightDetails.flightNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Route
                </span>
                <span>{flightDetails.origin} - {flightDetails.destination}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date
                </span>
                <span>
                  {format(new Date(flightDetails.departureDate), "dd MMM yyyy")}
                  {flightDetails.returnDate && ` - ${format(new Date(flightDetails.returnDate), "dd MMM yyyy")}`}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium flex items-center">
                  <IndianRupee className="h-4 w-4 mr-2" />
                  Base Fare
                </span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Taxes & Fees (18%)</span>
                <span>₹{taxes.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{finalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Select Payment Method</h3>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center cursor-pointer">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Credit/Debit Card
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center cursor-pointer">
                    <Banknote className="h-4 w-4 mr-2" />
                    UPI
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet" className="flex items-center cursor-pointer">
                    <Wallet className="h-4 w-4 mr-2" />
                    Wallet
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div>
            <form onSubmit={handlePayment} className="space-y-4">
              {paymentMethod === 'card' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Expiry Date</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        maxLength={5}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardCvv">CVV</Label>
                      <Input
                        id="cardCvv"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        maxLength={3}
                        required
                        type="password"
                      />
                    </div>
                  </div>
                </>
              )}
              
              {paymentMethod === 'upi' && (
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="example@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                </div>
              )}
              
              {paymentMethod === 'wallet' && (
                <div className="space-y-2">
                  <Label htmlFor="wallet">Choose Wallet</Label>
                  <select
                    id="wallet"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={walletProvider}
                    onChange={(e) => setWalletProvider(e.target.value)}
                    required
                  >
                    <option value="">Select a wallet</option>
                    <option value="paytm">Paytm</option>
                    <option value="phonepe">PhonePe</option>
                    <option value="amazonpay">Amazon Pay</option>
                    <option value="googlepay">Google Pay</option>
                  </select>
                </div>
              )}
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button 
                  type="submit" 
                  className="bg-airblue hover:bg-airblue-dark"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Pay ₹{finalAmount.toLocaleString('en-IN')}</>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
