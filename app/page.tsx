"use client";

import { useScreens } from "@/hooks/useScreens";

export default function Home() {
  const [screen] = useScreens();

  return (
    <main className="">
      <p>currentScreenId: {screen.id}</p>
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
