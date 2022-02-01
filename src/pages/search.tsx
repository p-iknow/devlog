import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import SEO from 'containers/SEO';
import { graphql } from 'gatsby';

import Layout from 'components/Layout';
import PostList from 'components/PostList';
import TextField from 'components/TextField';
import Title from 'components/Title';
import VerticalSpace from 'components/VerticalSpace';

import blogConfig from '../../blog-config';

const SearchWrapper = styled.div`
  margin-top: 20px;
  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

interface Props {
  data: {
    allMarkdownRemark: {
      nodes: {
        excerpt: string;
        fields: {
          slug: string;
        };
        frontmatter: {
          date: string;
          title: string;
          tags: string[];
        };
        rawMarkdownBody: string;
      }[];
    };
  };
}

const Search = ({ data }: Props) => {
  const posts = data.allMarkdownRemark.nodes;

  const [query, setQuery] = useState<string>('');

  const filteredPosts = useMemo(
    () =>
      posts.filter(post => {
        const { frontmatter, rawMarkdownBody } = post;
        const { title } = frontmatter;
        const lowerQuery = query.toLocaleLowerCase();

        if (rawMarkdownBody.toLocaleLowerCase().includes(lowerQuery)) return true;

        return title.toLocaleLowerCase().includes(lowerQuery);
      }),
    [query, posts]
  );

  return (
    <Layout>
      <SEO title={blogConfig.title} description={blogConfig.description} url={blogConfig.siteUrl} />
      <SearchWrapper>
        <Title size="sm">
          There are {filteredPosts.length} post{filteredPosts.length > 1 && 's'}.
        </Title>
        <TextField
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder="Search"
        />
      </SearchWrapper>
      <VerticalSpace size={70} />
      <PostList postList={filteredPosts} />
    </Layout>
  );
};

export default Search;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      nodes {
        excerpt(pruneLength: 200, truncate: true)
        fields {
          slug
        }
        frontmatter {
          date
          title
          tags
        }
        rawMarkdownBody
      }
    }
  }
`;
