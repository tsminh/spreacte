import React, { createContext, useContext } from "react";

export interface IGlobalContext {
  ratio: number;
  imgRootPath: string;
}

const GlobalContext = createContext<IGlobalContext>({
  ratio: 1,
  imgRootPath: "",
});

export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalContext;
