import ArticleBody from 'components/Article/Body';
import ArticleFooter from 'components/Article/Footer';
import ArticleHeader from 'components/Article/Header';
import ArticleSeries from 'components/Article/Series';
import Layout from 'components/Layout';
import { graphql } from 'gatsby';
import React from 'react';
import { blogConfig } from '../../blog-config';

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
        description
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
        description?: string;
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

  const { title, date, tags, series } = post.frontmatter;

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

export const Head = ({ data }: Props) => {
  const post = data.markdownRemark;
  const { title, tags, img, description } = post.frontmatter;
  const { slug } = post.fields;
  const ogImgUrl = img;
  const url = `${blogConfig.siteUrl}${slug}`;
  const metaDescription = description ?? post.excerpt;
  const keywords = tags.join(',');
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content={blogConfig.author} />
      {keywords && <meta name="keywords" content={keywords} />}
      {/* Facebook Meta Tags */}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImgUrl} />
      {/*  Twitter Meta Tags  */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="p-iknow.netlify.app" />
      <meta property="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImgUrl} />
      <meta name="twitter:label1" content="Category" />
      <meta name="twitter:data1" content="개발" />
    </>
  );
};
