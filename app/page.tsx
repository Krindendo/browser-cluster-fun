"use client";

import Dots from "@/components/dots";
import { useScreens } from "@/hooks/useScreens";

export default function Home() {
  const [screen, { getScreens }] = useScreens();

  return (
    <main className="h-full w-full">
      <p>current Screen Id: {screen.id}</p>
      <Dots getScreens={getScreens} />
    </main>
  );
}
