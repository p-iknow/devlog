import React, { ReactNode, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import { useSetTheme, useThemeState } from 'context';
import GlobalStyles from 'styles/GlobalStyles';
import { darkTheme, lightTheme } from 'styles/theme';

const Layout = ({ children }: { children: ReactNode }) => {
  const setTheme = useSetTheme();
  const theme = useThemeState();

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme === 'dark' ? 'light' : 'dark');
    localStorage.setItem('theme', nextTheme);
  };

  useEffect(() => {
    const isSystemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const localTheme = localStorage.getItem('theme');

    if (isSystemDarkMode && !localTheme) setTheme(isSystemDarkMode ? 'dark' : 'light');
    else setTheme(localTheme === 'dark' ? 'dark' : 'light');
  }, [setTheme]);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles />
      <Header toggleTheme={toggleTheme} />
      <Body>{children}</Body>
      <Footer />
    </ThemeProvider>
  );
};

export default Layout;
