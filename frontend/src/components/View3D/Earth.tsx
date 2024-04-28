import { useLoader } from "@react-three/fiber";
import { forwardRef } from "react";
import { TextureLoader } from "three";
import { MeshRef } from "./View3D";

const Earth = forwardRef<{
  earth?: MeshRef | null;
  clouds?: MeshRef | null;
}>((_, reference) => {
  // https://docs.pmnd.rs/react-three-fiber/tutorials/loading-textures
  const earth = useLoader(TextureLoader, "images/earth.jpg");
  const terrain = useLoader(TextureLoader, "images/terrain.jpg");
  const water = useLoader(TextureLoader, "images/water.png");
  const clouds = useLoader(TextureLoader, "images/clouds.png");

  return (
    <>
      {/* earth */}
      <mesh
        ref={(meshReference) => {
          if (reference && "current" in reference) {
            reference.current = {
              ...(reference.current ?? {}),
              earth: meshReference,
            };
          }
        }}
      >
        <sphereGeometry args={[5, 32, 32]} />
        <meshPhongMaterial map={earth} bumpMap={terrain} bumpScale={0.005} specularMap={water} specular="grey" />
      </mesh>
      {/* clouds */}
      <mesh
        ref={(meshReference) => {
          if (reference && "current" in reference) {
            reference.current = {
              ...(reference.current ?? {}),
              clouds: meshReference,
            };
          }
        }}
      >
        <sphereGeometry args={[5.03, 32, 32]} />
        <meshPhongMaterial map={clouds} transparent depthWrite={false} opacity={0.8} />
      </mesh>
    </>
  );
});

export default Earth;
