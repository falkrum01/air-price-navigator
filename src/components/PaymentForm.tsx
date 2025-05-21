
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Plane, Calendar, MapPin, CreditCard, IndianRupee, Banknote, Wallet, Loader2, Hotel, Home, Car } from "lucide-react";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

import { UserOptions } from 'jspdf-autotable';

interface PaymentFormProps {
  bookingDetails: {
    flight?: {
      airline: string;
      flightNumber?: string;
      id?: string;
      price: number;
      origin: string;
      destination: string;
      departureDate: string | Date;
      returnDate?: string | Date;
      passengers?: number;
      cabinClass?: string;
      departureTime?: string;
      arrivalTime?: string;
      duration?: string;
    };
    hotel?: {
      id: string;
      name: string;
      location: string;
      checkIn: Date;
      checkOut: Date;
      totalPrice: number;
      roomType: string;
      guestCount: number;
      pricePerNight: number;
      amenities?: string[];
      image?: string;
      rating?: number;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    hostel?: {
      id: string;
      name: string;
      location: string;
      checkIn: Date;
      checkOut: Date;
      totalPrice: number;
      bedType?: string;
      guestCount: number;
      pricePerNight: number;
      amenities?: string[];
      image?: string;
      rating?: number;
    };
    cab?: {
      id: string;
      type: string;
      price: number;
      pickupLocation: string;
      dropoffLocation: string;
      pickupTime: Date;
      distance: string;
      estimatedTime: string;
    };
  };
  totalAmount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ bookingDetails, totalAmount, onSuccess, onCancel }) => {
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
      
      // Prepare booking data - base structure
      const bookingData: any = {
        user_id: user?.id,
        price: finalAmount,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        booking_status: 'confirmed',
        booking_date: new Date().toISOString()
      };
      
      // Add flight details if available
      if (bookingDetails.flight) {
        bookingData.origin = bookingDetails.flight.origin;
        bookingData.destination = bookingDetails.flight.destination;
        bookingData.departure_date = bookingDetails.flight.departureDate;
        bookingData.return_date = bookingDetails.flight.returnDate || null;
        bookingData.airline = bookingDetails.flight.airline;
        bookingData.flight_id = bookingDetails.flight.id || bookingDetails.flight.flightNumber;
        
        if (bookingDetails.flight.cabinClass) {
          bookingData.cabin_class = bookingDetails.flight.cabinClass;
        }
        
        if (bookingDetails.flight.passengers) {
          bookingData.passenger_count = bookingDetails.flight.passengers;
        }
      }
      
      // Add hotel details if available
      if (bookingDetails.hotel) {
        bookingData.hotel_id = bookingDetails.hotel.id;
        bookingData.hotel_name = bookingDetails.hotel.name;
        bookingData.hotel_location = bookingDetails.hotel.location;
        bookingData.check_in_date = bookingDetails.hotel.checkIn;
        bookingData.check_out_date = bookingDetails.hotel.checkOut;
        bookingData.room_type = bookingDetails.hotel.roomType;
        bookingData.guest_count = bookingDetails.hotel.guestCount;
      }
      
      // Add hostel details if available
      if (bookingDetails.hostel) {
        bookingData.hostel_id = bookingDetails.hostel.id;
        bookingData.hostel_name = bookingDetails.hostel.name;
        bookingData.hostel_location = bookingDetails.hostel.location;
        bookingData.check_in_date = bookingDetails.hostel.checkIn;
        bookingData.check_out_date = bookingDetails.hostel.checkOut;
        bookingData.bed_type = bookingDetails.hostel.bedType || 'Standard';
        bookingData.guest_count = bookingDetails.hostel.guestCount;
      }
      
      // Add cab details if available
      if (bookingDetails.cab) {
        bookingData.cab_id = bookingDetails.cab.id;
        bookingData.cab_type = bookingDetails.cab.type;
        bookingData.pickup_location = bookingDetails.cab.pickupLocation;
        bookingData.dropoff_location = bookingDetails.cab.dropoffLocation;
        bookingData.pickup_time = bookingDetails.cab.pickupTime;
        bookingData.distance = bookingDetails.cab.distance;
        bookingData.estimated_time = bookingDetails.cab.estimatedTime;
      }
      
      // Save the booking to the database
      const { error } = await supabase.from('bookings').insert(bookingData);
      
      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Payment failed: ${error.message}`);
      }
      
      // Generate PDF ticket (if needed)
      generatePDF(transactionId);
      
      // Show success message
      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed! You can download your itinerary from the confirmation page.",
        variant: "default",
      });
      
      // Call the onSuccess callback
      setTimeout(() => {
        onSuccess();
      }, 1500);
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

  // This function is maintained for compatibility and called by the booking confirmation component
  const generatePDF = (transactionId: string) => {
    // We're not actually generating the PDF here since that will be handled by the BookingSummary component
    console.log(`Payment successful with transaction ID: ${transactionId}`);
    return transactionId;
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
  
  const { toast } = useToast();

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
          {/* Booking Summary Details */}
          <div>
            <div className="mt-8 border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-4">Your Booking Summary</h3>
              
              {/* Flight Details */}
              {bookingDetails.flight && (
                <div className="border-b pb-3 mb-3">
                  <div className="flex items-start gap-3 mb-2">
                    <Plane className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Flight</h4>
                      <p className="text-sm text-muted-foreground">
                        {bookingDetails.flight.airline} • {bookingDetails.flight.origin} to {bookingDetails.flight.destination}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Hotel Details */}
              {bookingDetails.hotel && (
                <div className="border-b pb-3 mb-3">
                  <div className="flex items-start gap-3 mb-2">
                    <Hotel className="h-5 w-5 text-amber-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Hotel</h4>
                      <p className="text-sm text-muted-foreground">
                        {bookingDetails.hotel.name}, {bookingDetails.hotel.location}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(bookingDetails.hotel.checkIn), "dd MMM yyyy")} - {format(new Date(bookingDetails.hotel.checkOut), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Hostel Details */}
              {bookingDetails.hostel && (
                <div className="border-b pb-3 mb-3">
                  <div className="flex items-start gap-3 mb-2">
                    <Home className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Hostel</h4>
                      <p className="text-sm text-muted-foreground">
                        {bookingDetails.hostel.name}, {bookingDetails.hostel.location}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(bookingDetails.hostel.checkIn), "dd MMM yyyy")} - {format(new Date(bookingDetails.hostel.checkOut), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Cab Details */}
              {bookingDetails.cab && (
                <div className="border-b pb-3 mb-3">
                  <div className="flex items-start gap-3 mb-2">
                    <Car className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Ground Transport</h4>
                      <p className="text-sm text-muted-foreground">
                        {bookingDetails.cab.type} • {bookingDetails.cab.pickupLocation} to {bookingDetails.cab.dropoffLocation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>₹{finalAmount.toLocaleString('en-IN')}</span>
                </div>
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
