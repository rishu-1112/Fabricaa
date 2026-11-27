import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "paper",
  setTheme: () => {},
  toggleTheme: () => {},
});

const STORAGE_KEY = "fabricaa-theme";

function readTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "paper" || stored === "ink") return stored;
  } catch {
    // Keep default when storage is unavailable.
  }
  return "paper";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "ink" ? "#06140f" : "#f7f5ee");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Theme still applies for the session.
    }
  }, [theme]);

  function setTheme(next) {
    setThemeState(next === "ink" ? "ink" : "paper");
  }

  function toggleTheme() {
    setThemeState((current) => (current === "ink" ? "paper" : "ink"));
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- Keep the theme hook with its provider.
export function useTheme() {
  return useContext(ThemeContext);
}
