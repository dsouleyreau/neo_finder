import "./Dashboard.css";

import { useState, useCallback, useEffect, useMemo } from "react";
import Asteroid, { AsteroidType } from "../Asteroids/Asteroid";
import { DateRange, Range } from "react-date-range";
import { formatDate } from "@/utils/format";

export interface Approach {
  date: string;
  /**
   * In kilometers
   */
  distance: number;
  asteroids: AsteroidType[];
}

type ApiResponse = Approach[];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AsteroidList() {
  const [range, setRange] = useState<Range>({ key: "selection" });

  const rdrNoSelection = useMemo(() => {
    return !range.startDate && !range.endDate;
  }, [range]);

  const [approaches, setApproaches] = useState<Approach[]>([]);

  const fetchData = useCallback(async (selectedRange: Range) => {
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
    fetchData(range);
  }, [range, fetchData]);

  return (
    <div className="flex flex-col gap-8">
      <h1>Asteroids</h1>
      <h2>Select a range of dates to display information about objects approaching earth during this period.</h2>
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
      {approaches.map((approach) => (
        <div key={approach.date}>
          <h3 className="p-8 text-3xl">{new Date(approach.date).toLocaleDateString()}</h3>
          <div className="grid grid-cols-3 gap-4 w-full">
            {approach.asteroids.map((asteroid, index) => (
              <Asteroid key={index} {...asteroid} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AsteroidList;
