import { useLoader } from "@react-three/fiber";
import { TextureLoader, BackSide } from "three";

const Universe = () => {
  const universe = useLoader(TextureLoader, "images/universe.png");

  return (
    <mesh>
      <sphereGeometry args={[200, 64, 64]} />
      <meshBasicMaterial map={universe} side={BackSide} />
    </mesh>
  );
};

export default Universe;
