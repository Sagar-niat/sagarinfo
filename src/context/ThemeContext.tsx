import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  themeMode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  setThemeMode: (mode: ThemeMode) => void;
  effectiveTheme: 'dark' | 'light';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('sagarinfo_theme');
    return (saved as ThemeMode) || 'dark';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    localStorage.setItem('sagarinfo_theme', theme);
    const root = document.documentElement;

    let computedTheme: 'dark' | 'light' = 'dark';
    if (theme === 'system') {
      computedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      computedTheme = theme;
    }

    setEffectiveTheme(computedTheme);

    if (computedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode: theme,
        setTheme,
        setThemeMode: setTheme,
        effectiveTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
