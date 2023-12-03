"use client";

import { MutableRefObject, useEffect, useRef } from "react";
import { useLocalStorage } from "usehooks-ts";
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
  registerScreen: any;
  unregisterScreen: any;
}

interface ScreenExist {
  name: string;
  signal: Date;
}

export function useScreens(): [MutableRefObject<string>, useScreensObject] {
  const [existingScreens, setExistingScreens] = useLocalStorage<string[]>(
    "existingScreens",
    []
  );
  const screenId = useRef(`screen-${getScreenId()}`);
  const windowScreen = useWindowScreen();

  function getScreens(): [string, WindowDetails][] {
    const storage = Object.entries(window.localStorage);

    const existingScreens1 = storage.filter(([key]) =>
      key.startsWith("screen-")
    );

    console.log("existingScreens", existingScreens);
    console.log("existingScreens1", existingScreens1);

    return existingScreens1.map(([key, value]: [string, string]) => [
      key,
      JSON.parse(value) as WindowDetails,
    ]);
  }

  function getScreenId() {
    const screenIds = existingScreens.map((key) =>
      parseInt(key.replace("screen-", ""))
    );
    const sortedScreens = screenIds.sort((a, b) => a - b);
    const lastScreenId = sortedScreens.at(-1);
    return lastScreenId ? lastScreenId + 1 : 1;
  }

  function registerScreen(screenId: string) {
    console.log(`adding screen ${screenId}`);
    setExistingScreens((prev) => [...prev, screenId]);
  }

  function unregisterScreen(screenId: string) {
    console.log(`removing screen ${screenId}`);
    setExistingScreens((prev) => {
      return prev.filter((prevScreen) => prevScreen === screenId);
    });
  }

  function emitPing() {
    //send ping to inform other screens that this screen is active

    window.localStorage.setItem(
      `ping_${screenId.current}`,
      Date.now().toString()
    );
  }

  function catchPing() {
    //active screen will check if other screens are active
    /*
    document.addEventListener('visibilitychange', function() {
        if(document.hidden)
            console.log('Page is hidden from user view');
        else
            console.log('Page is in user view');
    });
    */

    const excludeThisScreen = existingScreens.filter(
      (key) => key !== screenId.current
    );
    const screenIds = excludeThisScreen.map((key) => `ping_${key}`);

    screenIds.forEach((id) => {
      const lastTimePinged = window.localStorage.getItem(id);
      if (!lastTimePinged) {
        return;
      }
      const lastTimePingedDate = parseInt(lastTimePinged);

      console.log("lastTimePingedDate", lastTimePingedDate);

      if (lastTimePingedDate <= Date.now() + 1050) {
        unregisterScreen(id);
      }
    });
  }

  function setScreenDetails() {
    const windowDetails = {
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
    registerScreen(screenId.current);
    setInterval(emitPing, 1000);
    setInterval(catchPing, 1060);
    return () => unregisterScreen(screenId.current);
  }, []);

  return [
    screenId,
    {
      getScreens,
      getScreenId,
      setScreenDetails,
      registerScreen,
      unregisterScreen,
    },
  ];
}
