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

export function useScreens(): [MutableRefObject<string>, useScreensObject] {
  const screenId = useRef(`screen-${getScreenId()}`);
  const [existingScreens, setExistingScreens] = useLocalStorage<string[]>(
    "existingScreens",
    []
  );

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
    const storage = Object.keys(window.localStorage);

    const existingScreens = storage.filter((key) => key.startsWith("screen-"));

    if (existingScreens.length === 0) {
      return 1;
    }

    const screenIds = existingScreens.map((key) =>
      parseInt(key.replace("screen-", ""))
    );
    const sortedScreens = screenIds.sort((a, b) => a - b);
    const lastScreenId = sortedScreens.at(-1);

    if (lastScreenId) {
      return lastScreenId + 1;
    } else {
      return 1;
    }
  }

  function registerScreen() {
    console.log(`adding screen ${screenId.current}`);
    setExistingScreens((prev) => [...prev, screenId.current]);
  }

  function unregisterScreen() {
    console.log(`removing screen ${screenId.current}`);
    setExistingScreens((prev) => {
      return prev.filter((prevScreen) => prevScreen === screenId.current);
    });
  }

  function emitSignal() {
    //send signal to inform other screens that this screen is active
  }

  function catchSignal() {
    //checks for screen is active
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
    return () => unregisterScreen();
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
