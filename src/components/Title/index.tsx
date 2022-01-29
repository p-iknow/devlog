import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { ValueOf } from 'utils/type';

const TITLE_SIZE = {
  sm: '19.2',
  md: '25.6',
  bg: '33.6',
} as const;

interface Props {
  size: keyof typeof TITLE_SIZE;
  children: ReactNode;
}

const Title = ({ size, children }: Props) => {
  return <Wrapper size={TITLE_SIZE[size]}> {children} </Wrapper>;
};

const Wrapper = styled.h1<{
  size: ValueOf<typeof TITLE_SIZE>;
}>`
  margin-bottom: 24px;
  font-size: ${props => props.size}px;
  font-weight: 700;
  line-height: 1.3;
  color: ${props => props.theme.colors.text};
  word-break: break-all;

  & > a {
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
  }

  & > a:hover {
    color: ${props => props.theme.colors.secondaryText};
  }
`;

export default Title;
