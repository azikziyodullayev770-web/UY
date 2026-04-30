import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import IntegrationApp from "./app/IntegrationApp.jsx";
import ErrorBoundary from "./app/components/ErrorBoundary.jsx";
import "./styles/index.css";

// The app always renders.
// We are mounting the Node.js integrated app here.
// (Original App is preserved in ./app/App.tsx)
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <IntegrationApp />
    </ErrorBoundary>
  </StrictMode>
);