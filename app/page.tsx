import { PathMe } from "@/lib/path";
import { SVGProps, useEffect, useRef, useState } from "react";

type WindowDetails = {
  screenX: number;
  screenY: number;
  screenWidth: number;
  screenHeight: number;
  width: number;
  height: number;
  updated: number;
};

export default function Home() {
  const [timers, setTimers] = useState<ReturnType<typeof setInterval>[]>([]);
  const svgRef = useRef<SVGProps<SVGSVGElement>>();
  const pathRef = useRef<SVGProps<SVGPathElement>>();

  function getScreens(): [string, WindowDetails][] {
    return Object.entries(window.localStorage)
      .filter(([key]) => key.startsWith("screen-"))
      .map(([key, value]: [string, string]) => [
        key,
        JSON.parse(value) as WindowDetails,
      ]);
  }

  function getScreenId() {
    const existingScreens = Object.keys(window.localStorage)
      .filter((key) => key.startsWith("screen-"))
      .map((key) => parseInt(key.replace("screen-", "")))
      .sort((a, b) => a - b);

    return existingScreens.at(-1) + 1 || 1;
  }
  const screenId = `screen-${getScreenId()}`;

  function setScreenDetails() {
    const windowDetails = {
      screenX: window.screenX,
      screenY: window.screenY,
      screenWidth: window.screen.availWidth,
      screenHeight: window.screen.availHeight,
      width: window.outerWidth,
      height: window.innerHeight,
      updated: Date.now(),
    };
    window.localStorage.setItem(screenId, JSON.stringify(windowDetails));
    // console.log(windowDetails);
  }

  function displayStats() {
    if (!stats) return;
    const existingScreens = Object.fromEntries(getScreens());
    stats.innerHTML = JSON.stringify(existingScreens, null, " ");
  }

  function restart() {
    console.log(timers);
    timers.forEach((timer) => window.clearInterval(timer));
    window.localStorage.clear();
    setTimeout(() => window.location.reload(), Math.random() * 1000);
  }

  function removeScreen() {
    console.log(`removing screen ${screenId}`);
    localStorage.removeItem(screenId);
  }

  function removeOld() {
    const screens = getScreens();
    for (const [key, screen] of screens) {
      if (Date.now() - screen.updated > 1000) {
        localStorage.removeItem(key);
      }
    }
  }

  function makeSVG() {
    const screenPath = new PathMe();
    // Set the SVG viewBox using the screen size
    svgRef.current?.setAttribute(
      "viewBox",
      `0 0 ${window.screen.availWidth} ${window.screen.availHeight}`
    );
    svgRef.current?.setAttribute("width", `${window.screen.availWidth}px`);
    svgRef.current?.setAttribute("height", `${window.screen.availHeight}px`);
    // OFfset it by the window position
    svgRef.current?.setAttribute(
      "style",
      `transform: translate(-${window.screenX}px, -${window.screenY}px)`
    );
    const screens = getScreens();
    screens
      .map(([key, screen]) => {
        const x = screen.screenX + screen.width / 2;
        const y = screen.screenY + screen.height / 2;
        return [key, { ...screen, x, y }];
      })
      .forEach(([key, screen], i) => {
        if (i === 0) {
          screenPath.moveTo(screen.x, screen.y);
        } else {
          screenPath.lineTo(screen.x, screen.y);
        }
        // if (i === screens.length - 1) {
        // screenPath.lineTo(screens[0][1].x, screens[0][1].y);
        // }
      });

    screenPath.closePath();
    pathRef?.setAttribute("d", screenPath.toString());
  }

  useEffect(() => {
    setTimers([
      setInterval(setScreenDetails, 10),
      setInterval(displayStats, 10),
      setInterval(removeOld, 100),
      setInterval(makeSVG, 10),
    ]);
  }, []);

  clear?.addEventListener("click", restart);
  window.addEventListener("beforeunload", removeScreen);

  return (
    <main className="">
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        <path
          fill="none"
          stroke="#ffc600"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M271,74 L1015,344 M271,74 L271,74"
        ></path>
      </svg>
    </main>
  );
}
