/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { flow, map, groupBy, sortBy, filter, reverse } from 'lodash/fp';
import styled from 'styled-components';

import { graphql } from 'gatsby';

import Layout from 'components/Layout';
import Title from 'components/Title';
import SeriesList from 'components/SeriesList';
import VerticalSpace from 'components/VerticalSpace';
import NoContent from 'components/NoContent';

import { blogConfig } from '../../blog-config';

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
      nodes {
        excerpt(pruneLength: 200, truncate: true)
        fields {
          slug
        }
        frontmatter {
          date
          update
          title
          tags
          series
        }
      }
    }
  }
`;

type Frontmatter = {
  date: string;
  series: string;
  update: string;
  title: string;
  tags: string[];
};

type Post = {
  excerpt: string;
  fields: {
    slug: string;
  };
  frontmatter: Frontmatter;
};

interface Props {
  data: {
    site: {
      siteMetadata: {
        title: string;
      };
    };
    allMarkdownRemark: {
      group: {
        fieldValue: string;
        totalCount: number;
      }[];
      nodes: Post[];
    };
  };
}

type Series = {
  name: string;
  posts: {
    date: string;
    update: string;
    title: string;
    tags: string[];
    series: string;
    slug: string;
  }[];
  lastUpdated: string;
};

const SeriesPage = ({ data }: Props) => {
  const posts = data.allMarkdownRemark.nodes;
  const series: Series[] = flow(
    map<Post, Frontmatter & { slug: string }>(post => ({
      ...post.frontmatter,
      slug: post.fields.slug,
    })),
    groupBy<Frontmatter & { slug: string }>('series'),
    map(series => ({
      name: series[0].series,
      posts: series,
      lastUpdated: series[0].date,
    })),
    sortBy(series => new Date(series.lastUpdated)),
    filter(series => Boolean(series.name)),
    reverse
  )(posts);

  return (
    <Layout>
      <TagListWrapper>
        {series.length > 0 && <Title size="sm">There are {series.length} series.</Title>}
      </TagListWrapper>
      {series.length === 0 && <NoContent name="series" />}
      <VerticalSpace size={32} />
      <SeriesList seriesList={series} />
    </Layout>
  );
};

const TagListWrapper = styled.div`
  margin-top: 20px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

export default SeriesPage;

export const Head = ({ data }: Props) => {
  const ogImgUrl = `${blogConfig.siteUrl}/og-img.jpeg`;
  const title = data.site.siteMetadata.title;
  const description = blogConfig.description;
  const url = blogConfig.siteUrl + 'series/';
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
