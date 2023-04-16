require('katex/dist/katex.min.css');
require('pretendard/dist/web/static/pretendard-dynamic-subset.css');

import React from 'react';
import { ThemeContextProvider } from 'context';

interface RootProps {
  children: React.ReactNode;
}

const Root = ({ children }: RootProps) => <ThemeContextProvider>{children}</ThemeContextProvider>;

export default Root;
