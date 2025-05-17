
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PaymentForm from "./PaymentForm";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Plane, Calendar, Clock, Users, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
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
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  flightDetails
}) => {
  const [showPayment, setShowPayment] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleProceed = () => {
    setShowPayment(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        {!showPayment ? (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Flight Details</DialogTitle>
              <DialogDescription>
                Please review your flight details before proceeding to payment
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="bg-background p-2 rounded-full mr-3">
                      <Plane className="h-5 w-5 text-airblue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{flightDetails.airline}</h3>
                      <p className="text-sm text-muted-foreground">Flight {flightDetails.flightNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">₹{flightDetails.price.toLocaleString('en-IN')}</span>
                    <p className="text-xs text-muted-foreground">per passenger</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {format(new Date(flightDetails.departureDate), "dd MMM yyyy")}
                      </span>
                    </div>
                    
                    {flightDetails.departureTime && flightDetails.arrivalTime && (
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {flightDetails.departureTime} - {flightDetails.arrivalTime}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="capitalize">
                        {flightDetails.cabinClass} Class
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {flightDetails.passengers} {flightDetails.passengers > 1 ? 'Passengers' : 'Passenger'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <hr className="my-4 border-border" />
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{flightDetails.origin}</span> to <span className="font-medium">{flightDetails.destination}</span>
                    </p>
                    {flightDetails.duration && (
                      <p className="text-xs text-muted-foreground">
                        Duration: {flightDetails.duration}
                      </p>
                    )}
                  </div>
                  
                  {flightDetails.returnDate && (
                    <div className="text-right">
                      <p className="text-sm">Return</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(flightDetails.returnDate), "dd MMM yyyy")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium mb-2">Price Summary</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Base Fare ({flightDetails.passengers} {flightDetails.passengers > 1 ? 'passengers' : 'passenger'})</span>
                    <span>₹{(flightDetails.price * flightDetails.passengers).toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Taxes & Fees</span>
                    <span>₹{Math.round(flightDetails.price * flightDetails.passengers * 0.18).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{Math.round(flightDetails.price * flightDetails.passengers * 1.18).toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleProceed} className="bg-airblue hover:bg-airblue-dark">
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </>
        ) : (
          <PaymentForm 
            flightDetails={flightDetails} 
            onCancel={() => setShowPayment(false)} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
