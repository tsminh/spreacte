import { createContext, ReactNode, useContext, useMemo } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { ModalProvider } from "./Modal";
import Editor from "../editor";

interface IGlobalContext {
  ratio: number;
  imgRootPath: string;
}

const GlobalContext = createContext<IGlobalContext>({
  ratio: 1,
  imgRootPath: "",
});

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
      <ModalProvider>
        {children}
        {editorConfig && <Editor />}
      </ModalProvider>
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
