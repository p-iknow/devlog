import React from 'react';
import { graphql } from 'gatsby';

import styled from 'styled-components';

import Layout from 'components/Layout';
import PostList from 'components/PostList';
import Divider from 'components/Divider';
import { blogConfig } from '../../blog-config';

export const pageQuery = graphql`
  query BlogSeriesBySeriesName($series: String) {
    posts: allMarkdownRemark(
      sort: { frontmatter: { date: ASC } }
      filter: { frontmatter: { series: { eq: $series } } }
    ) {
      nodes {
        excerpt(pruneLength: 200, truncate: true)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          update(formatString: "MMM DD, YYYY")
          title
          tags
        }
      }
    }
  }
`;

interface Props {
  data: {
    posts: {
      nodes: {
        excerpt: string;
        fields: {
          slug: string;
        };
        frontmatter: {
          date: string;
          update: string;
          title: string;
          tags: string[];
        };
      }[];
    };
  };
  pageContext: {
    series: string;
  };
}

const Series = ({ pageContext, data }: Props) => {
  const seriesName = pageContext.series;
  const posts = data.posts.nodes;

  return (
    <>
      <Layout>
        <Header>
          <Subtitle> SERIES </Subtitle>
          <Title> {seriesName} </Title>
          <SeriesInform>
            <span>{posts.length} Posts</span>
            <span>·</span>
            <Date>Last updated on {posts[posts.length - 1].frontmatter.date}</Date>
          </SeriesInform>
          <Divider />
        </Header>
        <PostList postList={posts} />
      </Layout>
    </>
  );
};

const Header = styled.div`
  @media (max-width: 768px) {
    padding: 0px 15px;
  }
`;

const Title = styled.h1`
  margin-bottom: 15px;
  line-height: 1.2;
  font-size: 44.8px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  word-break: break-all;
`;

const Subtitle = styled.h3`
  display: inline-block;
  padding: 2px 3px;
  margin-top: 32px;
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: bold;
  background-color: ${props => props.theme.colors.text};
  color: ${props => props.theme.colors.bodyBackground};
  letter-spacing: -1px;
`;

const SeriesInform = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: ${props => props.theme.colors.text};

  & > span {
    margin: 0 3px;
  }
`;

const Date = styled.span`
  color: ${props => props.theme.colors.tertiaryText};
  font-weight: lighter;
`;

export default Series;

export const Head = ({ pageContext }: Props) => {
  const title = `SERIES: ${pageContext.series}`;
  const description = blogConfig.description;
  const ogImgUrl = `${blogConfig.siteUrl}/og-img.webp`;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content={blogConfig.author} />
      {/* Facebook Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImgUrl} />
      {/*  Twitter Meta Tags  */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="p-iknow.netlify.app" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImgUrl} />
      <meta name="twitter:label1" content="Category" />
      <meta name="twitter:data1" content="개발" />
    </>
  );
};
