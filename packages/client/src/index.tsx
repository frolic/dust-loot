import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Providers } from "./Providers";
import { App } from "./App";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./ui/ErrorFallback";

createRoot(document.getElementById("react-root")!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Providers>
        <App />
      </Providers>
    </ErrorBoundary>
  </StrictMode>
);
