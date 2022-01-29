import React, { createContext, useContext, useState } from 'react';

export type Theme = 'light' | 'dark';

export type SetTheme = (Theme: Theme) => void;

export const ThemeContext = createContext<Theme | null>(null);
export const SetThemeContext = createContext<SetTheme | null>(null);

export const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={theme}>
      <SetThemeContext.Provider value={setTheme}>{children}</SetThemeContext.Provider>
    </ThemeContext.Provider>
  );
};

export const useThemeState = () => {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('Cannot find ThemeProvider');
  return theme;
};

export const useSetTheme = () => {
  const setTheme = useContext(SetThemeContext);
  if (!setTheme) throw new Error('Cannot find ThemeProvider');

  return setTheme;
};
