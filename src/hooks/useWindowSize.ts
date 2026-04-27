import { useState, useEffect } from "react";

function useWindowSize(designWidth: number, skip?: boolean) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    ratio: window.innerWidth / designWidth,
  });

  useEffect(() => {
    if (skip) return;
    function handleResize() {
      const { innerWidth: width, innerHeight: height } = window;
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

    return () => {
      if (skip) return;
      window.removeEventListener("resize", handleResize);
    };
  }, [designWidth, skip]); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

export default useWindowSize;
