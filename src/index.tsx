import React from 'react';
import { GatsbySSR } from 'gatsby';
import { ThemeContextProvider } from 'context';

const wrapRootElement: GatsbySSR['wrapRootElement'] = ({ element }) => (
  <ThemeContextProvider>{element}</ThemeContextProvider>
);

export default wrapRootElement;
