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
  editorConfig?: IEditor;
}> = ({ children, width, imgRootPath = "", fixedRatio, editorConfig }) => {
  const { ratio } = useWindowSize(width, fixedRatio);
  const ctx = useMemo(() => ({ ratio: fixedRatio ? 1 : ratio, imgRootPath }), [fixedRatio, imgRootPath, ratio]);

  return (
    <GlobalContext.Provider value={ctx}>
      <ModalProvider>{children}</ModalProvider>
    </GlobalContext.Provider>
  );
};
