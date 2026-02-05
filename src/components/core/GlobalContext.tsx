import { createContext, ReactNode, useContext, useMemo } from "react";
import useWindowSize from "../hooks/useWindowSize";

const GlobalContext = createContext<{ ratio: number }>({
  ratio: 1,
});

export const GlobalContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { ratio } = useWindowSize();
  const ctx = useMemo(() => ({ ratio }), [ratio]);
  return <GlobalContext.Provider value={ctx}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = () => useContext(GlobalContext);
