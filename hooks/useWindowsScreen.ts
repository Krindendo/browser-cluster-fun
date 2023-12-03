import { useState } from "react";

import { useEventListener, useIsomorphicLayoutEffect } from "usehooks-ts";

interface WindowScreen {
  screenX: number;
  screenY: number;
  availWidth: number;
  availHeight: number;
  outerWidth: number;
  innerHeight: number;
}

export function useWindowScreen(): WindowScreen {
  const [windowScreen, setWindowScreen] = useState<WindowScreen>({
    screenX: 0,
    screenY: 0,
    availWidth: 0,
    availHeight: 0,
    outerWidth: 0,
    innerHeight: 0,
  });

  const handleSize = () => {
    setWindowScreen({
      screenX: window.screenX,
      screenY: window.screenY,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      outerWidth: window.outerWidth,
      innerHeight: window.innerHeight,
    });
  };

  useEventListener("resize", handleSize);

  // Set size at the first client-side load
  useIsomorphicLayoutEffect(() => {
    handleSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return windowScreen;
}
