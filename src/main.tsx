import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initWebMCPRuntime } from "./lib/webmcp";
import "./styles/index.css";

// Initialize document.modelContext on startup
initWebMCPRuntime();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
