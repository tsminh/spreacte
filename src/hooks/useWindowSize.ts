import { useState, useEffect } from "react";

function useWindowSize(designWidth: number) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    ratio: window.innerWidth / designWidth,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.screen.availWidth,
        height: window.screen.availHeight,
        ratio: window.screen.availWidth / designWidth,
      });
    }

    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [designWidth]); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

export default useWindowSize;
