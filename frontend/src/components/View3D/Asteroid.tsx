import { forwardRef, useMemo } from "react";
import { AsteroidType } from "../Asteroid/Asteroid";
import { MeshRef } from "./View3D";
import { TextureLoader, Vector3 } from "three";
import { ThreeEvent, useLoader } from "@react-three/fiber";
import { formatNumber } from "@/utils/format";

interface AsteroidProperties {
  asteroid: AsteroidType;
}

const displayToolTip = (event: ThreeEvent<PointerEvent>, setTooltipContent: (toolTip: HTMLElement) => void) => {
  // Set global cursor to pointer
  document.body.classList.add("cursor-pointer");

  const toolTip = document.getElementById("asteroidTooltip")!;

  setTooltipContent(toolTip);

  const { clientX, clientY } = event;

  // Avoid placing tooltip outside of the screen
  const minX = Math.min(clientX + 15, window.innerWidth - toolTip.clientWidth - 15);
  const minY = Math.min(clientY + 15, window.innerHeight - toolTip.clientHeight - 15);

  // Move to cursor with offset
  toolTip.style.left = `${minX}px`;
  toolTip.style.top = `${minY}px`;

  // Show tooltip
  toolTip.classList.remove("hidden");
};

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
      onPointerMove={(event) => {
        displayToolTip(event, (toolTip) => {
          // Avoid setting the same tooltip over and over
          if (toolTip.innerHTML.includes(asteroid.name)) return;

          const name = toolTip.querySelector(".name .content")!;
          name.innerHTML = asteroid.name;
        });
      }}
      onPointerOut={() => {
        document.body.classList.remove("cursor-pointer");
        const toolTip = document.getElementById("asteroidTooltip")!;

        toolTip.classList.add("hidden");
        toolTip.querySelector(".more")!.classList.add("hidden");
      }}
      onPointerDown={(event) => {
        displayToolTip(event, (toolTip) => {
          const size = toolTip.querySelector(".size .content")!;
          size.innerHTML = `${formatNumber(asteroid.size * 1000)}m`;

          const distance = toolTip.querySelector(".distance .content")!;
          distance.innerHTML = `${formatNumber(asteroid.distance / 384_400)} lunar distance`;

          const approach = toolTip.querySelector(".approach .content")!;
          approach.innerHTML = new Date(asteroid.approaches[0].date).toLocaleDateString();

          const approaches = toolTip.querySelector(".approaches")!;
          const approachesContent = approaches.querySelector(".content")!;

          approachesContent.innerHTML = asteroid.approaches
            .map((approach) => {
              return `${new Date(approach.date).toLocaleDateString()} - ${formatNumber(approach.distance)} km`;
            })
            .join("<br/>");

          // Display more information on click
          const more = toolTip.querySelector(".more")!;
          more.classList.remove("hidden");
        });
      }}
      position={v.multiplyScalar(distance)}
    >
      <sphereGeometry args={[size, 6, 6]} />
      <meshPhongMaterial map={map} emissive={0xffffff} emissiveIntensity={0.9} emissiveMap={glow} />
    </mesh>
  );
});

export default Asteroid;
