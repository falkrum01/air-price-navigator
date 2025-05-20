
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plane,
  Hotel,
  Home,
  Car,
  MapPin,
  Calendar,
  Clock,
  Users,
  FileText,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useBookingContext } from "@/contexts/BookingContext";
import { useToast } from "@/hooks/use-toast";

const BookingSummary: React.FC = () => {
  const { booking, getTotalPrice } = useBookingContext();
  const { toast } = useToast();
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const hasAnyBooking = booking.flight || booking.hotel || booking.hostel || booking.cab;
  
  const handleGeneratePDF = () => {
    setGeneratingPdf(true);
    // In a real app, this would call an API to generate a PDF
    setTimeout(() => {
      setGeneratingPdf(false);
      toast({
        title: "PDF generated",
        description: "Your travel itinerary has been generated and is ready for download.",
      });
    }, 2000);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return format(date, "PPP");
  };

  const formatTime = (time: string | undefined) => {
    if (!time) return "N/A";
    return time;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Travel Itinerary</h2>
        <p className="text-muted-foreground">
          Review your travel plans before finalizing your booking
        </p>
      </div>

      {!hasAnyBooking ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-lg font-medium">No bookings selected</p>
          <p className="text-muted-foreground mb-4">
            You haven't selected any travel components yet
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back to Search
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Flight Section */}
          {booking.flight && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Plane className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Flight Details</h3>
                    <p className="text-muted-foreground">
                      {booking.flight.airline} • {booking.flight.id}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-start gap-4">
                      <div className="min-w-[100px] text-right">
                        <p className="font-semibold">
                          {formatTime(booking.flight.departureTime)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(new Date(booking.flight.departureDate))}
                        </p>
                      </div>
                      <div className="flex-grow border-l pl-4 pb-6 ml-4 relative">
                        <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-[6.5px] -top-0"></div>
                        <p className="font-medium">{booking.flight.origin}</p>
                        <p className="text-muted-foreground">Departure</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="min-w-[100px] text-right">
                        <p className="font-semibold">
                          {formatTime(booking.flight.arrivalTime)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(new Date(booking.flight.departureDate))}
                        </p>
                      </div>
                      <div className="flex-grow border-l pl-4 relative">
                        <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-[6.5px] -top-0"></div>
                        <p className="font-medium">{booking.flight.destination}</p>
                        <p className="text-muted-foreground">Arrival</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p>Duration: {booking.flight.duration}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <p>
                        Passengers:{" "}
                        {booking.flight.passengers || 1}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-muted-foreground" />
                      <p>Cabin Class: {booking.flight.cabinClass || "Economy"}</p>
                    </div>
                    
                    <div className="mt-4 text-right">
                      <p className="text-lg font-semibold text-airblue">
                        ₹{booking.flight.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hotel/Hostel Section */}
          {(booking.hotel || booking.hostel) && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    {booking.hotel ? (
                      <Hotel className="h-5 w-5" />
                    ) : (
                      <Home className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {booking.hotel ? "Hotel" : "Hostel"} Details
                    </h3>
                    <p className="text-muted-foreground">
                      {booking.hotel?.name || booking.hostel?.name}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">
                          {booking.hotel?.location || booking.hostel?.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Stay Dates</p>
                        <p className="text-muted-foreground">
                          {formatDate(booking.hotel?.checkIn || booking.hostel?.checkIn)} -{" "}
                          {formatDate(booking.hotel?.checkOut || booking.hostel?.checkOut)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-muted-foreground" />
                      <p>
                        {booking.hotel
                          ? `Room Type: ${booking.hotel.roomType}`
                          : `Bed Type: ${booking.hostel?.bedType}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <p>
                        Guests:{" "}
                        {booking.hotel?.guestCount || booking.hostel?.guestCount}
                      </p>
                    </div>

                    <div className="mt-4 text-right">
                      <p className="text-lg font-semibold text-airblue">
                        ₹
                        {(
                          booking.hotel?.totalPrice ||
                          booking.hostel?.totalPrice ||
                          0
                        ).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ₹
                        {(
                          booking.hotel?.pricePerNight ||
                          booking.hostel?.pricePerNight ||
                          0
                        ).toLocaleString()}{" "}
                        × {booking.hotel?.checkIn && booking.hotel?.checkOut
                          ? Math.ceil((booking.hotel.checkOut.getTime() - booking.hotel.checkIn.getTime()) / (1000 * 60 * 60 * 24))
                          : booking.hostel?.checkIn && booking.hostel?.checkOut
                          ? Math.ceil((booking.hostel.checkOut.getTime() - booking.hostel.checkIn.getTime()) / (1000 * 60 * 60 * 24))
                          : 0} nights
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cab Section */}
          {booking.cab && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Car className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Ground Transportation</h3>
                    <p className="text-muted-foreground">{booking.cab.type} Cab</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Pickup</p>
                        <p className="text-muted-foreground">
                          {booking.cab.pickupLocation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Dropoff</p>
                        <p className="text-muted-foreground">
                          {booking.cab.dropoffLocation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Pickup Time</p>
                        <p className="text-muted-foreground">
                          {formatDate(booking.cab.pickupTime)} at{" "}
                          {booking.cab.pickupTime &&
                            format(booking.cab.pickupTime, "h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-muted-foreground" />
                      <p>Distance: {booking.cab.distance}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-muted-foreground" />
                      <p>Estimated Travel Time: {booking.cab.estimatedTime}</p>
                    </div>

                    <div className="mt-4 text-right">
                      <p className="text-lg font-semibold text-airblue">
                        ₹{booking.cab.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Price Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Price Summary</h3>
              
              <div className="space-y-3">
                {booking.flight && (
                  <div className="flex justify-between">
                    <span>Flight</span>
                    <span>₹{booking.flight.price.toLocaleString()}</span>
                  </div>
                )}
                
                {booking.hotel && (
                  <div className="flex justify-between">
                    <span>Hotel</span>
                    <span>₹{booking.hotel.totalPrice.toLocaleString()}</span>
                  </div>
                )}
                
                {booking.hostel && (
                  <div className="flex justify-between">
                    <span>Hostel</span>
                    <span>₹{booking.hostel.totalPrice.toLocaleString()}</span>
                  </div>
                )}
                
                {booking.cab && (
                  <div className="flex justify-between">
                    <span>Cab</span>
                    <span>₹{booking.cab.price.toLocaleString()}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PDF Download Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleGeneratePDF}
              className="flex items-center gap-2"
              disabled={generatingPdf}
            >
              {generatingPdf ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>Download Itinerary (PDF)</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSummary;
