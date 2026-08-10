import React, { createContext, useContext } from "react";

export interface IGlobalContext {
  ratio: number;
  imgRootPath: string;
  isMockedWindowSize?: boolean;
}

const GlobalContext = createContext<IGlobalContext>({
  ratio: 1,
  imgRootPath: "",
  isMockedWindowSize: false,
});

export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalContext;
