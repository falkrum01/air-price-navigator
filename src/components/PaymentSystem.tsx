import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Plane, Calendar, Hotel, Home, Car, MapPin, CreditCard, Wallet, IndianRupee, ShieldCheck, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useBookingContext } from "@/contexts/BookingContext";

interface PaymentSystemProps {
  onPaymentComplete: () => void;
  onCancel: () => void;
}

const PaymentSystem: React.FC<PaymentSystemProps> = ({ onPaymentComplete, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [walletProvider, setWalletProvider] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'summary' | 'payment'>('summary');
  
  const { booking, getTotalPrice } = useBookingContext();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalAmount = getTotalPrice();
  const taxRate = 0.18; // 18% tax
  const taxes = Math.round(totalAmount * taxRate);
  const finalAmount = totalAmount + taxes;

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handleCancelPayment = () => {
    onCancel();
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

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePaymentDetails()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Generate a random transaction ID
      const transactionId = `TXN${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      toast({
        title: "Payment Successful",
        description: `₹${finalAmount.toLocaleString('en-IN')} has been successfully paid.`,
        variant: "default",
      });
      
      // Call the onPaymentComplete callback
      setTimeout(() => {
        onPaymentComplete();
      }, 1000);
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{step === 'summary' ? 'Booking Summary' : 'Complete Payment'}</CardTitle>
        <CardDescription>
          {step === 'summary' 
            ? 'Review your booking details before payment' 
            : 'Please enter your payment details to complete your booking'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {step === 'summary' ? (
          <div className="space-y-6">
            {/* Booking Details Summary */}
            <div className="space-y-4">
              {/* Flight Details */}
              {booking.flight && (
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Plane className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Flight</h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.flight.airline} • {booking.flight.id}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">From - To</p>
                        <p className="text-sm">{booking.flight.origin} to {booking.flight.destination}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Date</p>
                        <p className="text-sm">{format(new Date(booking.flight.departureDate), "PPP")}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t flex justify-end">
                    <p className="font-medium">₹{booking.flight.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              )}
              
              {/* Hotel Details */}
              {booking.hotel && (
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      <Hotel className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Hotel</h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.hotel.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm">{booking.hotel.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Stay Duration</p>
                        <p className="text-sm">
                          {format(new Date(booking.hotel.checkIn), "MMM d")} - {format(new Date(booking.hotel.checkOut), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t flex justify-end">
                    <p className="font-medium">₹{booking.hotel.totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              )}
              
              {/* Hostel Details */}
              {booking.hostel && (
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Home className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Hostel</h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.hostel.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm">{booking.hostel.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Stay Duration</p>
                        <p className="text-sm">
                          {format(new Date(booking.hostel.checkIn), "MMM d")} - {format(new Date(booking.hostel.checkOut), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t flex justify-end">
                    <p className="font-medium">₹{booking.hostel.totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              )}
              
              {/* Cab Details */}
              {booking.cab && (
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <Car className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Ground Transport</h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.cab.type} Cab
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Route</p>
                        <p className="text-sm">{booking.cab.pickupLocation} to {booking.cab.dropoffLocation}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Pickup Date</p>
                        <p className="text-sm">{format(new Date(booking.cab.pickupTime), "PPP")}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t flex justify-end">
                    <p className="font-medium">₹{booking.cab.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Price Summary */}
            <div className="rounded-lg border p-4 bg-muted/50">
              <h3 className="font-semibold mb-3">Price Summary</h3>
              
              <div className="space-y-2">
                {booking.flight && (
                  <div className="flex justify-between text-sm">
                    <span>Flight</span>
                    <span>₹{booking.flight.price.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                {booking.hotel && (
                  <div className="flex justify-between text-sm">
                    <span>Hotel</span>
                    <span>₹{booking.hotel.totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                {booking.hostel && (
                  <div className="flex justify-between text-sm">
                    <span>Hostel</span>
                    <span>₹{booking.hostel.totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                {booking.cab && (
                  <div className="flex justify-between text-sm">
                    <span>Ground Transport</span>
                    <span>₹{booking.cab.price.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                <Separator className="my-2" />
                
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Taxes & Fees (18%)</span>
                  <span>₹{taxes.toLocaleString('en-IN')}</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span className="text-lg">₹{finalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Select Payment Method</h3>
                
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(val) => setPaymentMethod(val as 'card' | 'upi' | 'wallet')}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center cursor-pointer">
                      <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center cursor-pointer">
                      <IndianRupee className="h-5 w-5 mr-2 text-green-600" />
                      UPI
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center cursor-pointer">
                      <Wallet className="h-5 w-5 mr-2 text-purple-600" />
                      Mobile Wallet
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Smith"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Expiry Date (MM/YY)</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={handleCardExpiryChange}
                          maxLength={5}
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
                          type="password"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">Example: yourname@okhdfcbank, yourname@ybl</p>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'wallet' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="walletProvider">Select Wallet Provider</Label>
                    <Select value={walletProvider} onValueChange={setWalletProvider}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a wallet provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paytm">Paytm</SelectItem>
                        <SelectItem value="phonepe">PhonePe</SelectItem>
                        <SelectItem value="amazonpay">Amazon Pay</SelectItem>
                        <SelectItem value="mobikwik">MobiKwik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              <div className="rounded-md border p-3 bg-muted/50 flex gap-3 items-center">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <p className="text-sm">Your payment information is secure and encrypted.</p>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-md">
                <div className="flex justify-between font-semibold">
                  <span>Amount to be paid:</span>
                  <span>₹{finalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {step === 'summary' ? (
          <>
            <Button variant="outline" onClick={handleCancelPayment}>Cancel</Button>
            <Button onClick={handleProceedToPayment}>Proceed to Payment</Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setStep('summary')}>Back</Button>
            <Button 
              type="submit" 
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${finalAmount.toLocaleString('en-IN')}`
              )}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaymentSystem;
