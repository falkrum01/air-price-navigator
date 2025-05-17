
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface AirlineFilterProps {
  airlines: string[];
  selectedAirlines: string[];
  onSelectionChange: (selectedAirlines: string[]) => void;
}

const AirlineFilter: React.FC<AirlineFilterProps> = ({
  airlines,
  selectedAirlines,
  onSelectionChange,
}) => {
  const handleAirlineToggle = (airline: string) => {
    if (selectedAirlines.includes(airline)) {
      onSelectionChange(selectedAirlines.filter((a) => a !== airline));
    } else {
      onSelectionChange([...selectedAirlines, airline]);
    }
  };

  const selectAll = () => {
    onSelectionChange(airlines);
  };

  const selectNone = () => {
    onSelectionChange([]);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between mb-2 text-xs">
        <button
          type="button"
          onClick={selectAll}
          className="text-airblue hover:underline"
        >
          Select All
        </button>
        <button
          type="button"
          onClick={selectNone}
          className="text-airblue hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-1 max-h-36 overflow-y-auto pr-2">
        {airlines.map((airline) => (
          <div key={airline} className="flex items-center space-x-2">
            <Checkbox
              id={`airline-${airline}`}
              checked={selectedAirlines.includes(airline)}
              onCheckedChange={() => handleAirlineToggle(airline)}
            />
            <Label
              htmlFor={`airline-${airline}`}
              className="text-sm cursor-pointer"
            >
              {airline}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirlineFilter;
