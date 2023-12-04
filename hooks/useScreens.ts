"use client";

import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useWindowScreen } from "./useWindowsScreen";
import { useIsClient } from "usehooks-ts";
import { useInterval } from "usehooks-ts";

interface WindowDetails {
  screenX: number;
  screenY: number;
  screenWidth: number;
  screenHeight: number;
  width: number;
  height: number;
  updated: number;
}

interface useScreensObject extends WindowDetails {
  id: string;
}

interface useScreensFunctions {
  getScreens: any;
  getScreenId: any;
  setScreenDetails: any;
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
  const windowScreen = useWindowScreen();
  const screenId = useRef("");
  const [screen, setScreen] = useState<WindowDetails>(screenInit);

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
    /*
    document.addEventListener('visibilitychange', function() {
        if(document.hidden)
            console.log('Page is hidden from user view');
        else
            console.log('Page is in user view');
    });
    */

    const existingScreens = getScreens();

    existingScreens.forEach(([id, screen]) => {
      if (screen.updated + 1000 <= Date.now()) {
        window.localStorage.removeItem(id);
      }
    });
  }

  function setScreenDetails() {
    const windowDetails: WindowDetails = {
      screenX: windowScreen.screenX,
      screenY: windowScreen.screenY,
      screenWidth: windowScreen.availWidth,
      screenHeight: windowScreen.availHeight,
      width: windowScreen.outerWidth,
      height: windowScreen.innerHeight,
      updated: Date.now(),
    };

    setScreen(windowDetails);

    window.localStorage.setItem(
      screenId.current,
      JSON.stringify(windowDetails)
    );
  }

  useInterval(setScreenDetails, 10);
  useInterval(catchPing, 1050);

  return [
    { id: screenId.current, ...screen },
    {
      getScreens,
      getScreenId,
      setScreenDetails,
    },
  ];
}
