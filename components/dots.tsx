"use client";

import { PathMe } from "@/lib/path";
import { WindowDetails } from "@/types/globals";
import { useRef } from "react";
import { useInterval } from "usehooks-ts";

interface DotsProps {
  getScreens: () => [string, WindowDetails][];
}

export default function Dots({ getScreens }: DotsProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

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
        if (typeof screen === "string") {
          return;
        }

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
    pathRef.current?.setAttribute("d", screenPath.toString());
  }

  useInterval(makeSVG, 10);

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
    >
      <path
        ref={pathRef}
        fill="none"
        stroke="#ffc600"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M271,74 L1015,344 M271,74 L271,74"
      ></path>
    </svg>
  );
}
