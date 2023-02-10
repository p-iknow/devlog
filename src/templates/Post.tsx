import ArticleBody from 'components/Article/Body';
import ArticleFooter from 'components/Article/Footer';
import ArticleHeader from 'components/Article/Header';
import ArticleSeries from 'components/Article/Series';
import Layout from 'components/Layout';
import SEO from 'containers/SEO';
import { graphql } from 'gatsby';
import React from 'react';

import blogConfig from '../../blog-config';

interface Props {
  data: {
    site: {
      siteMetadata: {
        title: string;
      };
    };
    markdownRemark: {
      id: string;
      excerpt: string;
      html: string;
      frontmatter: {
        title: string;
        date: string;
        update: string;
        tags: string[];
        series: string;
        img?: string;
      };
      fields: {
        slug: string;
      };
    };
    seriesList: {
      edges: {
        node: {
          id: string;
          fields: {
            slug: string;
          };
          frontmatter: {
            title: string;
          };
        };
      }[];
    };
    previous: {
      fields: {
        slug: '/writing-guide/';
      };
      frontmatter: {
        title: '🤔 3. Writing Guide';
      };
    } | null;
    next: {
      fields: {
        slug: '/writing-guide/';
      };
      frontmatter: {
        title: '🤔 3. Writing Guide';
      };
    } | null;
  };
}

const Post = ({ data }: Props) => {
  const post = data.markdownRemark;
  const { previous, next, seriesList } = data;

  const { title, date, tags, series, img } = post.frontmatter;
  const { excerpt } = post;
  const { slug } = post.fields;

  const filteredSeries = series
    ? seriesList.edges.map(seriesPost => {
        if (seriesPost.node.id === post.id) {
          return {
            ...seriesPost.node,
            currentPost: true,
          };
        } else {
          return {
            ...seriesPost.node,
            currentPost: false,
          };
        }
      })
    : [];

  return (
    <Layout>
      <SEO
        title={title}
        description={excerpt}
        url={`${blogConfig.siteUrl}${slug}`}
        ogImg={img}
        keywords={tags}
      />
      <article>
        <ArticleHeader title={title} date={date} tags={tags} />
        {filteredSeries.length > 0 && <ArticleSeries header={series} series={filteredSeries} />}
        <ArticleBody html={post.html} />
        <ArticleFooter previous={previous} next={next} />
      </article>
    </Layout>
  );
};

export default Post;

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $series: String
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 200, truncate: true)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        update(formatString: "MMMM DD, YYYY")
        tags
        series
        img
      }
      fields {
        slug
      }
    }
    seriesList: allMarkdownRemark(
      sort: { frontmatter: { date: ASC } }
      filter: { frontmatter: { series: { eq: $series } } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
