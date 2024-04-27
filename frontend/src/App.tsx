import "./App.css";

import { useState, useCallback } from "react";
import Approach, { type ApproachType } from "./components/Approach/Approach";
import { formatDate } from "@/utils/format";
import DatesPicker from "./components/DatesPicker/DatesPicker";
import { type Range } from "react-date-range";

type ApiResponse = ApproachType[];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const App = () => {
  const [approaches, setApproaches] = useState<ApproachType[]>([]);

  const onDatesChange = useCallback(async (selectedRange: Range) => {
    try {
      const paramsObject: Record<string, string> = {};
      if (!selectedRange.startDate && !selectedRange.endDate) {
        return setApproaches([]);
      }
      if (selectedRange?.startDate) {
        console.log(selectedRange.startDate, formatDate(selectedRange.startDate));
        paramsObject["start_date"] = formatDate(selectedRange.startDate);
      }
      if (selectedRange?.endDate) {
        console.log(selectedRange.endDate, formatDate(selectedRange.endDate));
        paramsObject["end_date"] = formatDate(selectedRange.endDate);
      }
      const params = new URLSearchParams(paramsObject).toString();

      const response = await fetch(`${API_BASE_URL}/asteroids?${params}`);
      const data = (await response.json()) as ApiResponse;
      setApproaches(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <h1>Asteroids</h1>
      <h2>Select any date range (7 days max) to traverse space and discover asteroids near Earth.</h2>
      <DatesPicker onRangeChange={onDatesChange} />
      {approaches.map((approach) => (
        <Approach key={approach.date} {...approach} />
      ))}
    </div>
  );
};

export default App;
