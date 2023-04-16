import React, { useState, useEffect, Fragment } from 'react';
import styled from 'styled-components';

import { Link } from 'gatsby';

import Title from 'components/Title';
import Divider from 'components/Divider';
import TagList from 'components/TagList';
import { useThrottledCallback } from '@react-hookz/web';

const PostListWrapper = styled.div`
  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

const PostWrapper = styled.div`
  position: relative;
  top: 0;
  transition: all 0.5s;

  @media (max-width: 768px) {
    padding: 0 5px;
  }
`;

const Date = styled.p`
  margin-bottom: 16px;
  font-size: 14.4px;
  color: ${props => props.theme.colors.tertiaryText};
`;

const Excerpt = styled.p`
  margin-bottom: 32px;
  line-height: 1.7;
  font-size: 16px;
  color: ${props => props.theme.colors.secondaryText};
  word-break: break-all;
`;

const checkIsScrollAtBottom = () => {
  return (
    document.documentElement.scrollHeight - document.documentElement.scrollTop <=
    document.documentElement.clientHeight + 100
  );
};

interface Props {
  postList: {
    excerpt: string;
    fields: {
      slug: string;
    };
    frontmatter: {
      date: string;
      title: string;
      tags: string[];
    };
  }[];
}

const PostList = ({ postList }: Props) => {
  const [postCount, setPostCount] = useState(20);

  const handleMoreLoad = useThrottledCallback(
    () => {
      if (checkIsScrollAtBottom() && postCount < postList.length) {
        setTimeout(() => setPostCount(postCount + 20), 300);
      }
    },
    [postCount, postList],
    250
  );

  useEffect(() => {
    window.addEventListener('scroll', handleMoreLoad);

    return () => {
      window.removeEventListener('scroll', handleMoreLoad);
    };
  }, [handleMoreLoad]);

  return (
    <PostListWrapper>
      {postList.slice(0, postCount).map((post, i) => {
        const { title, date, tags } = post.frontmatter;
        const { excerpt } = post;
        const { slug } = post.fields;

        return (
          <Fragment key={slug}>
            <PostWrapper>
              <Title size="bg">
                <Link to={slug}>{title}</Link>
              </Title>
              <Date>{date}</Date>
              <Excerpt>{excerpt}</Excerpt>
              <TagList tagList={tags} />
            </PostWrapper>

            {postCount - 1 !== i && postList.length - 1 !== i && <Divider mt={48} mb={32} />}
          </Fragment>
        );
      })}
    </PostListWrapper>
  );
};

export default PostList;
