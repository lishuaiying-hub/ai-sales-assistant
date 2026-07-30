import React from 'react';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import App from "./App.tsx";
import { AuthProvider } from './contexts/authContext.tsx';
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
      <Toaster 
        position="top-right"
        richColors
        expand={false}
        duration={3000}
      />
    </HashRouter>
  </StrictMode>
);
