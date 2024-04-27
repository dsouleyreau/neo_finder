import "./DatesPicker.css";

import { useState, useEffect, useMemo } from "react";
import { DateRange, type Range } from "react-date-range";

interface DatesPickerProperties {
  onRangeChange: (range: Range) => void;
}

const DatesPicker: React.FC<DatesPickerProperties> = ({ onRangeChange }) => {
  const [range, setRange] = useState<Range>({ key: "selection" });

  // fix empty selection: https://github.com/hypeserver/react-date-range/issues/360#issuecomment-724560224
  const rdrNoSelection = useMemo(() => {
    return !range.startDate && !range.endDate;
  }, [range]);

  const minDate = useMemo(() => {
    if (range.endDate) {
      const date = new Date(range.endDate);
      date.setDate(date.getDate() - 7);
      return date;
    }
  }, [range.endDate]);

  const maxDate = useMemo(() => {
    if (range.startDate) {
      const date = new Date(range.startDate);
      date.setDate(date.getDate() + 7);
      return date;
    }
  }, [range.startDate]);

  useEffect(() => {
    onRangeChange(range);
  }, [range, onRangeChange]);

  return (
    <div className="relative w-max mx-auto">
      <DateRange
        ranges={[range]}
        minDate={minDate}
        maxDate={maxDate}
        onChange={({ selection }) => setRange(selection)}
        className={"w-96 " + (rdrNoSelection ? "rdrNoSelection" : "")}
      />
      <span
        className="absolute bottom-1/2 right-0 py-1 px-2 text-3xl cursor-pointer text-black"
        role="button"
        onClick={() => setRange({ startDate: undefined, endDate: undefined, key: "selection" })}
      >
        ×
      </span>
    </div>
  );
};

export default DatesPicker;
