import { useLoader } from "@react-three/fiber";
import { forwardRef } from "react";
import { TextureLoader } from "three";
import { MeshRef } from "./View3D";

const Moon = forwardRef<MeshRef>((_, reference) => {
  const moon = useLoader(TextureLoader, "images/moon.jpg");

  return (
    <mesh
      ref={(meshReference) => {
        if (reference && "current" in reference) {
          reference.current = meshReference;
        }
      }}
    >
      <sphereGeometry args={[1.3, 32, 32]} />
      <meshStandardMaterial map={moon} />
    </mesh>
  );
});

export default Moon;
