import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import Context from "./component/context/Context";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(
  <Context>
    <App />
  </Context>
);
