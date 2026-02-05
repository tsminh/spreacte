import ReactDOM from "react-dom/client";
import App from "./App";
import boostrap from "./boostrap";
import { GlobalContextProvider } from "./components/core/GlobalContext";

boostrap();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <GlobalContextProvider>
    <App />
  </GlobalContextProvider>,
);
