
import React, { createContext, useContext, useEffect } from "react";

// We only want to use dark theme, but we need the proper type definition
type Theme = "dark";

interface ThemeContextType {
  theme: Theme;
  // We're removing toggleTheme since we only want dark mode
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme: Theme = "dark";

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove any other theme class and add dark
    root.classList.remove("light");
    root.classList.add("dark");
    
    // Save to localStorage for consistency
    localStorage.setItem("jobwise-theme", theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
