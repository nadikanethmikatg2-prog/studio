
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
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme && ['blue', 'rose', 'green', 'orange'].includes(storedTheme)) {
      setTheme(storedTheme);
    }
  }, []);
  
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-rose', 'theme-green', 'theme-orange');
    
    if (theme !== 'blue') {
      root.classList.add(`theme-${theme}`);
    }
    
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
