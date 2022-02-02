/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

import { animateScroll } from 'react-scroll';
import useScroll from 'hooks/useScroll';
import { getElementOffset } from 'utils/getElementOffset';
import RevealOnScroll from 'components/RevealOnScroll';

const STICK_OFFSET = 100;

interface Props {
  items: HTMLHeadElement[];
  articleOffset: number;
}
const Toc = ({ items, articleOffset }: Props) => {
  const { y } = useScroll();

  const [revealAt, setRevealAt] = useState(4000);
  const [headers, setHeaders] = useState<number[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const bioElm = document.getElementById('bio') as HTMLElement;
    setRevealAt(getElementOffset(bioElm).top - bioElm.getBoundingClientRect().height - 400);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLHeadElement>(
      '#article-body > h2, #article-body > h3'
    );
    setHeaders([...elements].map(element => getElementOffset(element).top));
  }, []);

  useEffect(() => {
    headers.forEach((header, i) => {
      if (header - 300 < y) {
        setActive(i);
        return;
      }
    });
  }, [y, headers]);

  const handleClickTitle = (index: number) => {
    animateScroll.scrollTo(headers[index] - 100);
  };

  return (
    <RevealOnScroll revealAt={revealAt} reverse>
      <TocWrapper stick={y > articleOffset - STICK_OFFSET}>
        <div>
          {items.map((item, i) => (
            <ParagraphTitle
              key={i}
              hasSubTitle={item.tagName === 'H3'}
              active={i === active}
              onClick={() => handleClickTitle(i)}
            >
              {item.innerText}
            </ParagraphTitle>
          ))}
        </div>
      </TocWrapper>
    </RevealOnScroll>
  );
};

const TocWrapper = styled.div<{ stick: boolean }>`
  position: absolute;
  opacity: 1;
  left: 100%;

  & > div {
    padding-right: 20px;
    padding-left: 16px;
    margin-left: 48px;
    position: relative;
    width: 240px;
    max-height: calc(100% - 185px);
    overflow-y: auto;

    :hover::-webkit-scrollbar {
      width: 5px;
    }
    :hover::-webkit-scrollbar-track {
      background: ${props => props.theme.colors.scrollTrack};
    }

    :hover::-webkit-scrollbar-thumb {
      background: ${props => props.theme.colors.scrollHandle};
    }
    ${props =>
      props.stick &&
      css`
        position: fixed;
        top: ${STICK_OFFSET}px;
        overflow-y: scroll;
      `}
  }

  @media (max-width: 1300px) {
    display: None;
  }
`;

const ParagraphTitle = styled.div<{ hasSubTitle: boolean; active: boolean }>`
  margin-bottom: 8px;
  padding-left: ${props => (props.hasSubTitle ? 19.2 : 0)}px;
  font-size: 14.4px;
  color: ${props => props.theme.colors.mutedText};
  line-height: 1.3;
  transition: all 0.2s;

  ${props =>
    props.active &&
    css`
      transform: translate(-11.2px, 0);
      color: ${props => props.theme.colors.secondaryText};
    `}

  &:hover {
    color: ${props => props.theme.colors.text};
    cursor: pointer;
  }
`;

export default Toc;
