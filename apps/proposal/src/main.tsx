import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import LicenseGate from "./components/LicenseGate";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LicenseGate>
      <App />
    </LicenseGate>
  </StrictMode>,
);
