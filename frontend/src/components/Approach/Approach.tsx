import Asteroid, { type AsteroidType } from "../Asteroid/Asteroid";

export interface ApproachType {
  date: string;
  /**
   * In kilometers
   */
  distance: number;
  asteroids: AsteroidType[];
}

const Approach = (approach: ApproachType) => {
  return (
    <div>
      <h3 className="py-8 text-3xl">{new Date(approach.date).toLocaleDateString()}</h3>
      <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4 w-full">
        {approach.asteroids.map((asteroid, index) => (
          <Asteroid key={index} {...asteroid} />
        ))}
      </div>
    </div>
  );
};

export default Approach;
