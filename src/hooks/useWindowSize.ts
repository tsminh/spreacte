import { useState, useEffect } from "react";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    ratio: window.innerWidth / 393,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.screen.availWidth,
        height: window.screen.availHeight,
        ratio: window.screen.availWidth / 393,
      });
    }

    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

export default useWindowSize;
