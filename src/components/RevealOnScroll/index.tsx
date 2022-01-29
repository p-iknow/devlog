import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';

import useScroll from 'hooks/useScroll';

const StyledWrapper = styled.div<{ visible: boolean }>`
  position: relative;
  opacity: 0;
  transition: 0.35s all ease;
  ${props =>
    props.visible &&
    css`
      opacity: 1;
    `}
`;

interface Props {
  revealAt: number;
  reverse: boolean;
  children: ReactNode;
}

const RevealOnScroll = ({ revealAt, reverse, children }: Props) => {
  const { y } = useScroll();
  const reveal = reverse ? y < revealAt : y > revealAt;
  return <StyledWrapper visible={reveal}>{children}</StyledWrapper>;
};

export default RevealOnScroll;
