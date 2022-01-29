/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { flow, map, groupBy, sortBy, filter, reverse } from 'lodash/fp';
import styled from 'styled-components';
import SEO from 'components/SEO';

import { graphql } from 'gatsby';

import Layout from 'components/Layout';
import Title from 'components/Title';
import SeriesList from 'components/SeriesList';
import VerticalSpace from 'components/VerticalSpace';
import NoContent from 'components/NoContent';

import blogConfig from '../../blog-config';

const TagListWrapper = styled.div`
  margin-top: 20px;

  @media (max-width: 768px) {
    padding: 0 15px;
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
      <SEO title={blogConfig.title} description={blogConfig.description} url={blogConfig.siteUrl} />

      <TagListWrapper>
        {series.length > 0 && <Title size="sm">There are {series.length} series.</Title>}
      </TagListWrapper>

      {series.length === 0 && <NoContent name="series" />}

      <VerticalSpace size={32} />

      <SeriesList seriesList={series} />
    </Layout>
  );
};

export default SeriesPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
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
          series
        }
      }
    }
  }
`;
