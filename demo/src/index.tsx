import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "@react-spectrum/s2";
import App from "./App";
import "@tsminh/spreacte/dist/esm/assets/editor.css";
import "@react-spectrum/s2/page.css";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider background="base">
    <App />
  </Provider>,
);
