
import React from 'react';
import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";

interface BookingButtonProps {
  price: number;
  onClick: () => void;
}

const BookingButton: React.FC<BookingButtonProps> = ({ price, onClick }) => {
  return (
    <Button 
      className="bg-airblue hover:bg-airblue-dark transition-colors flex items-center" 
      onClick={onClick}
    >
      <IndianRupee className="mr-1 h-4 w-4" />
      <span>{price.toLocaleString('en-IN')}</span>
      <span className="ml-2">Select</span>
    </Button>
  );
};

export default BookingButton;
