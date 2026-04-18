import { useState, useEffect } from "react";

function useWindowSize(designWidth: number) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    ratio: window.innerWidth / designWidth,
  });

  useEffect(() => {
    function handleResize() {
      const { availWidth: width, availHeight: height } = window.screen;
      document.documentElement.style.setProperty("--vw", `${width}px`);
      document.documentElement.style.setProperty("--vh", `${height}px`);
      setWindowSize({
        width,
        height,
        ratio: width / designWidth,
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
