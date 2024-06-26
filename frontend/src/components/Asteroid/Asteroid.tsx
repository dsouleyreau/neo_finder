import { useMemo } from "react";
import { formatNumber } from "@/utils/format";
import Icon from "@/assets/asteroid.svg?react";
import Modal from "@/components/Modal/Modal";
import { type ApproachType } from "../Approach/Approach";

export interface AsteroidType {
  name: string;
  /**
   * In kilometers
   */
  size: number;
  /**
   * In kilometers
   */
  distance: number;
  danger: boolean;
  approaches: ApproachType[];
}

const Asteroid = (asteroid: AsteroidType) => {
  const normalizedSize = useMemo(() => (Math.log10(asteroid.size / 10) + 6) * 16, []);

  const color = useMemo(() => {
    const size = asteroid.size * 1_000;
    switch (true) {
      case !asteroid.danger:
        return "green";
      case size < 10:
        return "yellow";
      case size < 50:
        return "orange";
      case size < 100:
        return "red";
      default:
        return "darkred";
    }
  }, []);

  return (
    <div className="rounded-xl px-4 py-6 flex flex-col gap-4 pointer even:bg-gray-700 odd:bg-gray-800 w-full text-white">
      <div className="flex items-center">
        <div className="flex justify-center items-center w-20 h-20">
          <Icon className="w-auto inline-block" style={{ height: `${normalizedSize}px`, fill: color }} />
        </div>
        <span className="text-center text-lg font-bold grow">{asteroid.name}</span>
      </div>
      <div className="p-4 flex flex-col gap-2 text-left">
        <div>
          <b>Size (m):</b>&nbsp;
          <span>{formatNumber(asteroid.size * 1_000)}</span>
        </div>
        <div>
          <b>Passing close to earth by:</b>
          &nbsp;
          <span>{formatNumber(asteroid.distance / 384_400)} lunar distance</span>
        </div>
      </div>
      <div className="grow flex justify-center items-end">
        <Modal btnText="More information" title={asteroid.name}>
          <div className="flex flex-col gap-2 text-left">
            <div>
              <b>Is considered dangerous for earth:</b>
              &nbsp;
              <span>{asteroid.danger ? "Yes" : "No"}</span>
            </div>
            <b>Last five approaches:</b>
            <ul className="list-none">
              {asteroid.approaches.slice(0, 5).map((approach) => (
                <li key={approach.date}>
                  {new Date(approach.date).toLocaleDateString()} - {formatNumber(approach.distance)} km
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Asteroid;
