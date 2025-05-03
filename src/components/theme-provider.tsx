
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "bright";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem("app-theme");
    return (storedTheme as Theme) || "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === "bright") {
      root.classList.add("bright-theme");
    } else {
      root.classList.remove("bright-theme");
    }
    
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
