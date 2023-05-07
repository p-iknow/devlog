import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { graphql } from 'gatsby';

import Layout from 'components/Layout';
import PostList from 'components/PostList';
import TextField from 'components/TextField';
import Title from 'components/Title';
import VerticalSpace from 'components/VerticalSpace';
import { blogConfig } from '../../blog-config';

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
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
    <>
      <Layout>
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
    </>
  );
};

const SearchWrapper = styled.div`
  margin-top: 20px;
  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

export default Search;

export const Head = () => {
  const ogImgUrl = `${blogConfig.siteUrl}/og-img.webp`;
  const title = `p-iknow's dev-log search page`;
  const description = `p-iknow's dev-log search page`;
  const url = blogConfig.siteUrl + '/search/';
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content={blogConfig.author} />
      {/* Facebook Meta Tags */}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImgUrl} />
      {/*  Twitter Meta Tags  */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="p-iknow.netlify.app" />
      <meta property="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImgUrl} />
      <meta name="twitter:label1" content="Category" />
      <meta name="twitter:data1" content="개발" />
    </>
  );
};
