import "@radix-ui/themes/styles.css";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Theme } from "@radix-ui/themes";
import { BrowserRouter } from "react-router";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Theme>
  </StrictMode>,
)
