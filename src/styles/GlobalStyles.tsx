import React from 'react';
import { createGlobalStyle } from 'styled-components';

import reset from 'styled-reset';

const CustomStyles = createGlobalStyle`
	${reset}
	body {
		font-family: 'Noto Sans KR', sans-serif;
		background: ${props => props.theme.colors.bodyBackground};
	}
`;

const GlobalStyles = () => <CustomStyles />;

export default GlobalStyles;
