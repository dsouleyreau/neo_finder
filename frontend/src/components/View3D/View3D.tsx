import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  type Mesh,
  type BufferGeometry,
  type NormalBufferAttributes,
  type Material,
  type Object3DEventMap,
} from "three";
import Earth from "./Earth";
import Moon from "./Moon";
import Universe from "./Universe";
import { useMemo, useRef } from "react";
import { AsteroidType } from "../Asteroid/Asteroid";
import Asteroid from "./Asteroid";
import { ApproachType } from "../Approach/Approach";

interface View3DProperties {
  approaches: ApproachType[];
}

const DEFAULT_DISTANCE = 250;
const SCREEN_WIDTH = 1366;
const SCREEN_HEIGHT = 768;

// made with: https://github.com/uncultivatedrabbit/Asteroid-Finder-API-Hack/blob/master/js/app.js

export type MeshRef = Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>;

const _View3D: React.FC<View3DProperties> = ({ approaches }) => {
  const asteroids = useMemo(() => {
    // Create a map of asteroids to avoid duplicates
    const asteroids = new Map<string, AsteroidType>();

    approaches.forEach((approach) => {
      approach.asteroids.forEach((asteroid) => {
        asteroids.set(asteroid.name, asteroid);
      });
    });

    return Array.from(asteroids.values());
  }, [approaches]);

  const asteroidMeshes = useMemo(
    () =>
      asteroids.map((asteroid, index) => {
        return (
          <Asteroid
            key={index}
            asteroid={asteroid}
            ref={(meshReference) => (asteroidRefs.current[index] = meshReference)}
          />
        );
      }),
    [asteroids],
  );

  const earthRef = useRef<{
    earth: MeshRef;
    clouds: MeshRef;
  }>(null);
  const moonRef = useRef<MeshRef | null>(null);
  const asteroidRefs = useRef<(MeshRef | null)[]>([]);

  // Update objects before canvas frame update
  // with delta time since last frame
  useFrame(({ clock: { elapsedTime } }, deltaTime) => {
    const { earth, clouds } = earthRef.current ?? {};
    const moon = moonRef.current;
    const asteroids = asteroidRefs.current;

    if (!(earth && clouds && moon)) return;

    const t = elapsedTime * 0.1;
    const d = deltaTime * 0.01;

    const orbitRadius = 30;

    earth.rotation.y += 3 * d;
    clouds.rotation.y += 4 * d;
    asteroids.forEach((asteroid) => {
      if (!asteroid) return;

      asteroid.rotation.y += 0.03;
      asteroid.rotation.x += 0.03;
    });
    moon.rotation.y += 5 * d;
    moon.position.set(
      -Math.cos(t) * orbitRadius,
      moon.position.y - (Math.cos(t) * orbitRadius) / 5000,
      Math.sin(t) * orbitRadius,
    );
  }, 0);

  return (
    <>
      <ambientLight color={0x666666} />
      <directionalLight color={0xeeeeee} position={[5, 3, 5]} />
      <Earth ref={earthRef} />
      <Moon ref={moonRef} />
      {asteroidMeshes}
      <Universe />
      <OrbitControls minDistance={8} maxDistance={DEFAULT_DISTANCE} />
    </>
  );
};

// useFrame should be used inside a Canvas component
const View3D: React.FC<View3DProperties> = (properties) => {
  const aspectRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
  return (
    <>
      <div>
        Hold and move (or zoom) on following 3d view to watch the minimum distance each asteroid passes by Earth.
        <br />
        Hover and click on asteroids to see more information
      </div>
      <div
        id="asteroidTooltip"
        className="fixed z-10 text-white bg-black bg-opacity-80 p-2 rounded-lg flex flex-col gap-2 text-left hidden"
      >
        <div className="name">
          <span className="text-orange-400">Name:</span>&nbsp;
          <span className="content"></span>
        </div>
        <div className="more flex flex-col gap-2 hidden">
          <div className="size">
            <span className="text-orange-400">Size:</span>&nbsp;
            <span className="content"></span>
          </div>
          <div className="distance">
            <span className="text-orange-400">Passing close to earth by:</span>&nbsp;
            <span className="content"></span>
          </div>
          <div className="approach">
            <span className="text-orange-400">Most recent approach:</span>&nbsp;
            <span className="content"></span>
          </div>
          <div className="approaches">
            <div className="text-orange-400 text-center">Last 5 approaches</div>
            <span className="content"></span>
          </div>
        </div>
      </div>
      <Canvas
        camera={{ fov: 45, aspect: aspectRatio, near: 1, far: 1000, position: [0, 0, DEFAULT_DISTANCE] }}
        style={{ aspectRatio }}
      >
        <_View3D {...properties} />
      </Canvas>
    </>
  );
};

export default View3D;
