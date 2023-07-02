import type { WrapPageElementNodeArgs } from 'gatsby';
import React from 'react';
import Root from './src';

export const wrapPageElement = ({ element }: WrapPageElementNodeArgs) => {
  return <Root>{element}</Root>;
};
