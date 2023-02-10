import React from 'react';
import styled from 'styled-components';

import { blogConfig } from '../../../../blog-config';

import Divider from 'components/Divider';
import TagList from 'components/TagList';

const Wrapper = styled.div`
  margin-top: 32px;
  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

const ArticleTitle = styled.h1`
  margin-bottom: 25.6px;
  line-height: 1.2;
  font-size: 35px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const Information = styled.div`
  margin-bottom: 32px;
  font-size: 16px;
`;

const Author = styled.span`
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const Date = styled.span`
  font-weight: 300;
  color: ${props => props.theme.colors.secondaryText};
`;

interface Props {
  date: string;
  tags: string[];
  title: string;
}

const ArticleHeader = ({ title, date, tags }: Props) => {
  return (
    <Wrapper>
      <ArticleTitle> {title} </ArticleTitle>
      <Information>
        <Author> @{blogConfig.author} </Author>
        <Date>· {date} </Date>
      </Information>
      {tags && <TagList tagList={tags} />}
      <Divider mt={0} />
    </Wrapper>
  );
};

export default ArticleHeader;
