import type { WrapPageElementBrowserArgs } from 'gatsby';
import React from 'react';
import Root from './src';

export const wrapPageElement = ({ element }: WrapPageElementBrowserArgs) => {
  return <Root>{element}</Root>;
};
