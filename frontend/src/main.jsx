import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

try {
  const theme = localStorage.getItem("fabricaa-theme");
  if (theme === "paper" || theme === "ink") {
    document.documentElement.dataset.theme = theme;
  }
} catch {
  // Default paper theme remains.
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ThemeProvider>
  </React.StrictMode>
);
