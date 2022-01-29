import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import styled, { useTheme } from 'styled-components';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import ReactUtterences from 'react-utterances';

import blogConfig from '../../../../blog-config';

import MDSpinner from 'react-md-spinner';

import Divider from 'components/Divider';
import Bio from 'components/Bio';
import { useThemeState } from 'context';

const ArticleButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    margin-bottom: 80px;
    padding: 0 12.8px;
    flex-direction: column;

    & > div:first-child {
      margin-bottom: 12.8px;
    }
  }
`;

const ArrowFlexWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

const ArticleButtonTextWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  overflow: hidden;
`;

const Arrow = styled.div`
  position: relative;
  left: 0;
  display: flex;
  align-items: center;
  font-size: 24px;
  flex-basis: 24px;
  transition: left 0.3s;
`;

const ArticleButtonWrapper = styled.div<{ right: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.right ? 'flex-end' : 'flex-start')};
  padding: 20.8px 16px;
  max-width: 250px;
  flex-basis: 250px;
  font-size: 17.6px;
  border-radius: 5px;
  background-color: ${props => props.theme.colors.nextPostButtonBackground};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.theme.colors.hoveredNextPostButtonBackground};
  }

  & ${ArrowFlexWrapper} {
    flex-direction: ${props => (props.right ? 'row-reverse' : 'row')};
  }

  & ${ArticleButtonTextWrapper} {
    align-items: ${props => (props.right ? 'flex-end' : 'flex-start')};
  }

  & ${Arrow} {
    ${props => (props.right ? 'margin-left: 16px' : 'margin-right: 16px')};
  }

  &:hover ${Arrow} {
    left: ${props => (props.right ? 2 : -2)}px;
  }

  @media (max-width: 768px) {
    max-width: inherit;
    flex-basis: inherit;
  }
`;

const ArticleButtonLabel = styled.div`
  margin-bottom: 9.6px;
  font-size: 12.8px;
`;

const ArticleButtonTitle = styled.div`
  padding: 2px 0;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const CommentWrapper = styled.div`
  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HiddenWrapper = styled.div<{ isHidden: boolean }>`
  display: ${props => (props.isHidden ? 'none' : 'block')};
`;

const ArticleButton = ({
  right = false,
  children,
  onClick,
}: {
  right?: boolean;
  children?: ReactNode;
  onClick?: () => void;
}) => {
  return (
    <ArticleButtonWrapper right={right} onClick={onClick}>
      <ArrowFlexWrapper>
        <Arrow>{right ? <BiRightArrowAlt /> : <BiLeftArrowAlt />}</Arrow>
        <ArticleButtonTextWrapper>
          <ArticleButtonLabel>{right ? <>Next Post</> : <>Previous Post</>}</ArticleButtonLabel>
          <ArticleButtonTitle>{children}</ArticleButtonTitle>
        </ArticleButtonTextWrapper>
      </ArrowFlexWrapper>
    </ArticleButtonWrapper>
  );
};

const Spinner = () => {
  const theme = useTheme();
  return (
    <SpinnerWrapper>
      <MDSpinner singleColor={theme.colors.spinner} />
    </SpinnerWrapper>
  );
};

const Comment = () => {
  const theme = useThemeState();
  const [flag, setFlag] = useState(false);

  const setCommentTheme = useCallback(() => {
    const message = {
      type: 'set-theme',
      theme: `github-${theme}`,
    };

    let utteranceIframe = null;
    utteranceIframe = document.querySelector('iframe.utterances-frame') as HTMLIFrameElement;

    if (utteranceIframe) {
      utteranceIframe.contentWindow?.postMessage(message, 'https://utteranc.es');
    }
  }, [theme]);

  useEffect(() => {
    setCommentTheme();
  }, [setCommentTheme]);

  useEffect(() => {
    setTimeout(() => {
      if (!flag) {
        setCommentTheme();
        setFlag(true);
      }
    }, 2000);
  }, [setCommentTheme, flag]);

  return (
    <>
      {flag || <Spinner />}
      <HiddenWrapper isHidden={!flag}>
        <ReactUtterences repo={blogConfig.utterances.repo} type={blogConfig.utterances.type} />
      </HiddenWrapper>
    </>
  );
};
interface Props {
  next: {
    fields: {
      slug: string;
    };
    frontmatter: {
      title: string;
    };
  } | null;

  previous: {
    fields: {
      slug: string;
    };
    frontmatter: {
      title: string;
    };
  } | null;
}

const ArticleFooter = ({ previous, next }: Props) => {
  return (
    <>
      <ArticleButtonContainer>
        {previous ? (
          <ArticleButton
            onClick={async () => {
              await navigate(previous?.fields?.slug);
            }}
          >
            {previous?.frontmatter?.title}
          </ArticleButton>
        ) : (
          <div></div>
        )}
        {next && (
          <ArticleButton
            right
            onClick={async () => {
              await navigate(next?.fields?.slug);
            }}
          >
            {next?.frontmatter?.title}
          </ArticleButton>
        )}
      </ArticleButtonContainer>
      <Bio />
      <CommentWrapper>
        <Divider mt={32} />
        <Comment />
      </CommentWrapper>
    </>
  );
};

export default ArticleFooter;
