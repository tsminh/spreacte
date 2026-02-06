import { createContext, ReactNode, useContext, useEffect, useMemo } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { measureWindowSize } from "../utils";

const GlobalContext = createContext<{ ratio: number; imgRootPath?: string }>({
  ratio: 1,
  imgRootPath: "",
});

export const GlobalContextProvider: React.FC<{ children: ReactNode; width: number; imgRootPath?: string }> = ({
  children,
  width,
  imgRootPath = "",
}) => {
  const { ratio } = useWindowSize(width);
  const ctx = useMemo(() => ({ ratio, imgRootPath }), [imgRootPath, ratio]);

  useEffect(() => {
    window.addEventListener("resize", measureWindowSize);
    measureWindowSize();
  }, []);

  return <GlobalContext.Provider value={ctx}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = () => useContext(GlobalContext);
