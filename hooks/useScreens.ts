"use client";

import { useEffect, useRef, useState } from "react";
import { useEventListener, useIsClient } from "usehooks-ts";
import { useInterval } from "usehooks-ts";
import { WindowDetails } from "@/types/globals";

interface useScreensObject extends WindowDetails {
  id: string;
}

interface useScreensFunctions {
  getScreens: () => [string, WindowDetails][];
  getScreenId: () => number;
  setScreenDetails: () => void;
}

const screenInit: WindowDetails = {
  height: 0,
  width: 0,
  screenHeight: 0,
  screenWidth: 0,
  screenX: 0,
  screenY: 0,
  updated: Date.now(),
};

export function useScreens(): [useScreensObject, useScreensFunctions] {
  const isClient = useIsClient();
  const screenId = useRef("");
  const [screen, setScreen] = useState<WindowDetails>(screenInit);
  const documentRef = useRef<Document>(null);

  useEventListener("visibilitychange", () => {}, documentRef);

  useEffect(() => {
    if (isClient) {
      screenId.current = `screen-${getScreenId()}`;
    }
  }, [isClient]);

  function getScreens(): [string, WindowDetails][] {
    if (typeof window === "undefined") {
      return [];
    }
    const storage = Object.entries<string>(window.localStorage);

    const existingScreens = storage.filter(([key]) =>
      key.startsWith("screen-")
    );

    return existingScreens.map(([key, value]) => [
      key,
      JSON.parse(value) as WindowDetails,
    ]);
  }

  function getScreenId() {
    if (typeof window === "undefined") {
      return -1;
    }
    const storage = Object.keys(window.localStorage);

    const screenIds = storage.map((key) =>
      parseInt(key.replace("screen-", ""))
    );
    const sortedScreens = screenIds.sort((a, b) => a - b);
    const lastScreenId = sortedScreens.at(-1);
    return lastScreenId ? lastScreenId + 1 : 1;
  }

  function catchPing() {
    //active screen will check if other screens are actives

    if (documentRef.current?.hidden) {
      return;
    }

    const existingScreens = getScreens();

    existingScreens.forEach(([id, screen]) => {
      if (screen.updated + 2500 <= Date.now()) {
        window.localStorage.removeItem(id);
      }
    });
  }

  function setScreenDetails() {
    if (typeof window === "undefined") {
      return;
    }

    const windowDetails: WindowDetails = {
      screenX: window.screenX,
      screenY: window.screenY,
      screenWidth: window.screen.availWidth,
      screenHeight: window.screen.availHeight,
      width: window.outerWidth,
      height: window.innerHeight,
      updated: Date.now(),
    };

    setScreen(windowDetails);

    window.localStorage.setItem(
      screenId.current,
      JSON.stringify(windowDetails)
    );
  }

  useInterval(setScreenDetails, 50);
  useInterval(catchPing, 1500);

  return [
    { id: screenId.current, ...screen },
    {
      getScreens,
      getScreenId,
      setScreenDetails,
    },
  ];
}
