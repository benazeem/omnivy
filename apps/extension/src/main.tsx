import { Provider } from "react-redux";
import { store } from "./store";
import { createRoot } from "react-dom/client";
import "./index.css";
import Popup from "./pages/Popup.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Popup />
  </Provider>
);
