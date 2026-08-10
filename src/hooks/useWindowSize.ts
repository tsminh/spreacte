import { useState, useEffect } from "react";

function useWindowSize(designWidth: number, skip?: boolean, mockWindowSize?: { width: number; height: number }) {
  const [windowSize, setWindowSize] = useState({
    width: mockWindowSize?.width ?? window.innerWidth,
    height: mockWindowSize?.height ?? window.innerHeight,
    ratio: (mockWindowSize?.width ?? window.innerWidth) / designWidth,
  });

  useEffect(() => {
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

    if (skip || !!mockWindowSize) {
      if (mockWindowSize) {
        document.documentElement.style.setProperty("--vw", `${mockWindowSize.width}px`);
        document.documentElement.style.setProperty("--vh", `${mockWindowSize.height}px`);
        return;
      }
      document.documentElement.style.setProperty("--vw", `100vw`);
      document.documentElement.style.setProperty("--vh", `100vh`);
      return;
    }

    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    return () => {
      if (skip) return;
      window.removeEventListener("resize", handleResize);
    };
  }, [designWidth, mockWindowSize, skip]);

  return windowSize;
}

export default useWindowSize;
