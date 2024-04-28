import { forwardRef, useMemo } from "react";
import { AsteroidType } from "../Asteroid/Asteroid";
import { MeshRef } from "./View3D";
import { TextureLoader, Vector3 } from "three";
import { useLoader } from "@react-three/fiber";

interface AsteroidProperties {
  asteroid: AsteroidType;
}

const Asteroid = forwardRef<MeshRef, AsteroidProperties>(({ asteroid }, reference) => {
  const map = useLoader(TextureLoader, "images/asteroid.jpg");
  const glow = useLoader(TextureLoader, asteroid.danger ? "images/red-glow.jpg" : "images/green-glow.jpg");
  // Set random position at fixed distance from same center
  const v = useMemo(
    () =>
      new Vector3(
        // Set position between -0.5 and 0.5
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      )
        // normalize x, y, z so that the distance is always 1
        .normalize(),
    [],
  );

  const size = Math.log10(asteroid.size * 10000) / 5;
  const distance = Math.log10(asteroid.distance / 1_000) * 25;

  return (
    <mesh
      ref={(meshReference) => {
        if (reference && "current" in reference) {
          reference.current = meshReference;
        }
      }}
      position={v.multiplyScalar(distance)}
    >
      <sphereGeometry args={[size, 6, 6]} />
      <meshPhongMaterial map={map} emissive={0xffffff} emissiveIntensity={0.9} emissiveMap={glow} />
    </mesh>
  );
});

export default Asteroid;
