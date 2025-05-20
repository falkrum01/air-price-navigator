
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Flight } from "@/types/flight";
import { Hotel, Hostel, Cab } from "@/types/booking";

interface BookingContextType {
  booking: {
    flight: Flight | null;
    hotel: Hotel | null;
    hostel: Hostel | null;
    cab: Cab | null;
  };
  setFlightBooking: (flight: Flight) => void;
  setHotelBooking: (hotel: Hotel) => void;
  setHostelBooking: (hostel: Hostel) => void;
  setCabBooking: (cab: Cab) => void;
  resetBooking: () => void;
  hasFlightBooked: boolean;
  hasAccommodationBooked: boolean;
  hasCabBooked: boolean;
  getTotalPrice: () => number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [booking, setBooking] = useState<BookingContextType["booking"]>({
    flight: null,
    hotel: null,
    hostel: null,
    cab: null,
  });

  const setFlightBooking = (flight: Flight) => {
    setBooking((prev) => ({ ...prev, flight }));
  };

  const setHotelBooking = (hotel: Hotel) => {
    setBooking((prev) => ({ ...prev, hotel, hostel: null }));
  };

  const setHostelBooking = (hostel: Hostel) => {
    setBooking((prev) => ({ ...prev, hostel, hotel: null }));
  };

  const setCabBooking = (cab: Cab) => {
    setBooking((prev) => ({ ...prev, cab }));
  };

  const resetBooking = () => {
    setBooking({
      flight: null,
      hotel: null,
      hostel: null,
      cab: null,
    });
  };

  const hasFlightBooked = Boolean(booking.flight);
  const hasAccommodationBooked = Boolean(booking.hotel || booking.hostel);
  const hasCabBooked = Boolean(booking.cab);

  const getTotalPrice = (): number => {
    let total = 0;
    if (booking.flight) total += booking.flight.price;
    if (booking.hotel) total += booking.hotel.totalPrice;
    if (booking.hostel) total += booking.hostel.totalPrice;
    if (booking.cab) total += booking.cab.price;
    return total;
  };

  return (
    <BookingContext.Provider
      value={{
        booking,
        setFlightBooking,
        setHotelBooking,
        setHostelBooking,
        setCabBooking,
        resetBooking,
        hasFlightBooked,
        hasAccommodationBooked,
        hasCabBooked,
        getTotalPrice,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBookingContext must be used within a BookingProvider");
  }
  return context;
};
