import { createContext, ReactNode, useContext, useMemo } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { ModalProvider } from "./Modal";

interface IGlobalContext {
  ratio: number;
  imgRootPath: string;
}

const GlobalContext = createContext<IGlobalContext>({
  ratio: 1,
  imgRootPath: "",
});

export const GlobalContextProvider: React.FC<{
  children: ReactNode;
  width: number;
  imgRootPath?: string;
  fixedRatio?: boolean;
}> = ({ children, width, imgRootPath = "", fixedRatio }) => {
  const { ratio } = useWindowSize(width, fixedRatio);
  const ctx = useMemo(() => ({ ratio: fixedRatio ? 1 : ratio, imgRootPath }), [fixedRatio, imgRootPath, ratio]);

  return (
    <GlobalContext.Provider value={ctx}>
      <ModalProvider>{children}</ModalProvider>
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
