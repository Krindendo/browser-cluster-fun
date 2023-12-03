"use client";

import { useScreens } from "@/hooks/useScreens";
import { useEffect, useState } from "react";

export default function Home() {
  const [timers, setTimers] = useState<ReturnType<typeof setInterval>[]>([]);
  const [currentScreenId, { setScreenDetails }] = useScreens();

  useEffect(() => {
    setTimers([
      setInterval(setScreenDetails, 10),
      //setInterval(displayStats, 10),
      //setInterval(removeOld, 100),
      //setInterval(makeSVG, 10),
    ]);
  }, []);

  return (
    <main className="">
      <p>currentScreenId: {currentScreenId.current}</p>
    </main>
  );
}

// function displayStats() {
//   if (!stats) return;
//   const existingScreens = Object.fromEntries(getScreens());
//   stats.innerHTML = JSON.stringify(existingScreens, null, " ");
// }

// function restart() {
//   console.log(timers);
//   timers.forEach((timer) => window.clearInterval(timer));
//   window.localStorage.clear();
//   setTimeout(() => window.location.reload(), Math.random() * 1000);
// }

// useEffect(() => {
//   setTimers([
//     setInterval(setScreenDetails, 10),
//     //setInterval(displayStats, 10),
//     setInterval(removeOld, 100),
//     setInterval(makeSVG, 10),
//   ]);

//   return () => removeScreen();
// }, []);

//clear?.addEventListener("click", restart);
