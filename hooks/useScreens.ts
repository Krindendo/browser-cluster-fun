"use client";

import { MutableRefObject, useEffect, useRef } from "react";
import { useWindowScreen } from "./useWindowsScreen";

interface WindowDetails {
  screenX: number;
  screenY: number;
  screenWidth: number;
  screenHeight: number;
  width: number;
  height: number;
  updated: number;
}

interface useScreensObject {
  getScreens: any;
  getScreenId: any;
  setScreenDetails: any;
}

export function useScreens(): [MutableRefObject<string>, useScreensObject] {
  const screenId = useRef(`screen-${getScreenId()}`);

  const windowScreen = useWindowScreen();

  function getScreens(): [string, WindowDetails][] {
    const storage = Object.entries(window.localStorage);

    const existingScreens = storage.filter(([key]) =>
      key.startsWith("screen-")
    );

    return existingScreens.map(([key, value]: [string, string]) => [
      key,
      JSON.parse(value) as WindowDetails,
    ]);
  }

  function getScreenId() {
    console.log("window.localStorage", window.localStorage);

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

    const storage = Object.entries(window.localStorage);

    //const excludeThisScreen = storage.filter((key) => key !== screenId.current);
    //const screenIds = excludeThisScreen.map((key) => `ping_${key}`);

    storage.forEach(([id, screen]) => {
      //console.log("lastTimePingedDate", lastTimePingedDate);

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

    window.localStorage.setItem(
      screenId.current,
      JSON.stringify(windowDetails)
    );
  }

  useEffect(() => {
    setInterval(catchPing, 1050);
  }, []);

  return [
    screenId,
    {
      getScreens,
      getScreenId,
      setScreenDetails,
    },
  ];
}
