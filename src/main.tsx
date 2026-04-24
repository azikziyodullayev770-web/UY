import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// The app always renders.
// - If Firebase credentials are missing → Demo Mode (phone OTP = 123456)
// - If Firebase credentials are set     → Real Firebase Auth
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);