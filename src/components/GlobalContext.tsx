import { createContext, ReactNode, useContext, useEffect, useMemo } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { measureWindowSize } from "../utils";
import { ModalProvider } from "./Modal";

interface IGlobalContext {
  ratio: number;
  imgRootPath: string;
}

const GlobalContext = createContext<IGlobalContext>({
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

  return (
    <GlobalContext.Provider value={ctx}>
      <ModalProvider>{children}</ModalProvider>
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
