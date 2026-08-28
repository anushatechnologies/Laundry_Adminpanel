'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type AdminTheme = 'light' | 'dark' | 'green';

interface ThemeContextType {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>('light');

  useEffect(() => {
    const saved = localStorage.getItem('laundryfresh_admin_theme') as AdminTheme;
    if (saved && ['light', 'dark', 'green'].includes(saved)) {
      setThemeState(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const setTheme = (newTheme: AdminTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('laundryfresh_admin_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback default if used outside provider
    return {
      theme: 'light' as AdminTheme,
      setTheme: (t: AdminTheme) => {
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem('laundryfresh_admin_theme', t);
      },
    };
  }
  return context;
}
