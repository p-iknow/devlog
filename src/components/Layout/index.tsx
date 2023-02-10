import React, { ReactNode } from 'react';
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
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

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
