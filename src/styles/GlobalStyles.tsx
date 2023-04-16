import React from 'react';
import { createGlobalStyle } from 'styled-components';

import reset from 'styled-reset';
import CodeStyle from 'styles/code';

const CustomStyles = createGlobalStyle`
	${reset}
	${CodeStyle}
	body {
		font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
		background: ${props => props.theme.colors.bodyBackground};
	}

`;

const GlobalStyles = () => <CustomStyles />;

export default GlobalStyles;
