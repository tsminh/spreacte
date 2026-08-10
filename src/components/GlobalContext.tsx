import React, { ReactNode, useMemo } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { ModalProvider } from "./Modal";
import GlobalContext from "./GlobalContextCore";

interface IEditor {
  savePath: string;
}

export const GlobalContextProvider: React.FC<{
  children: ReactNode;
  width: number;
  imgRootPath?: string;
  fixedRatio?: boolean;
  mockWindowSize?: { width: number; height: number };
}> = ({ children, width, imgRootPath = "", fixedRatio, mockWindowSize }) => {
  const { ratio } = useWindowSize(width, fixedRatio, mockWindowSize);
  const ctx = useMemo(
    () => ({ ratio: fixedRatio ? 1 : ratio, imgRootPath, isMockedWindowSize: !!mockWindowSize }),
    [fixedRatio, imgRootPath, ratio, mockWindowSize],
  );

  return (
    <GlobalContext.Provider value={ctx}>
      <ModalProvider>{children}</ModalProvider>
    </GlobalContext.Provider>
  );
};
