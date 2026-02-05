import { isDev } from "./utils";
import VConsole from "vconsole";

const ms = () => {
  document.documentElement.style.setProperty("--vw", `${window.innerWidth}px`);
  document.documentElement.style.setProperty("--vh", `${window.innerHeight}px`);
};

const boostrap = () => {
  window.addEventListener("resize", ms);
  ms();
  if (isDev() || window.origin.includes("-dev")) new VConsole();

  window.addEventListener("load", () => {
    const root = document.getElementById("root");
    if (root) root.style.opacity = "1";
  });
};

export default boostrap;
