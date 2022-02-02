import React from 'react';
import { createGlobalStyle } from 'styled-components';

import reset from 'styled-reset';

const CustomStyles = createGlobalStyle`
	${reset}
	body {
		font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
		background: ${props => props.theme.colors.bodyBackground};
	}
`;

const GlobalStyles = () => <CustomStyles />;

export default GlobalStyles;
