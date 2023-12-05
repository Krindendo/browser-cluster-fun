"use client";

import { Canvas } from "@react-three/fiber";
import Screne from "./screne";
import { a } from "@react-spring/three";

export default function Liquid({}) {
  return (
    <Canvas className="h-full" dpr={[1, 2]}>
      <Screne />
    </Canvas>
  );
}
