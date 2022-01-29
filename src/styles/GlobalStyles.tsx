import React from 'react';
import { createGlobalStyle } from 'styled-components';

import reset from 'styled-reset';
import { GlobalStyles as BaseStyles } from 'twin.macro';

const CustomStyles = createGlobalStyle`
	${reset}
	body {
		font-family: 'Noto Sans KR', sans-serif;
		background: ${props => props.theme.colors.bodyBackground};
	}
`;

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
);

export default GlobalStyles;
