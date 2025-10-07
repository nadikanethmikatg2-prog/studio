
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'blue' | 'rose' | 'green' | 'orange';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('blue');

  useEffect(() => {
    // Get stored theme from local storage
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme && ['blue', 'rose', 'green', 'orange'].includes(storedTheme)) {
      setTheme(storedTheme);
    }
  }, []);
  
  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove('theme-rose', 'theme-green', 'theme-orange');
    
    // Add the current theme class if it's not the default
    if (theme !== 'blue') {
      document.documentElement.classList.add(`theme-${theme}`);
    }
    
    // Save theme to local storage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
