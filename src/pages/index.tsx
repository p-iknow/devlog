import React from 'react';
import { graphql } from 'gatsby';

import Layout from 'components/Layout';
import Bio from 'components/Bio';
import PostList from 'components/PostList';
import Divider from 'components/Divider';
import VerticalSpace from 'components/VerticalSpace';

import SideCategoryList from 'components/SideCategoryList';
import { blogConfig } from '../../blog-config';
import { sortBy } from 'remeda';

// 알고리즘은 index page에서 제외하도록 세팅함
export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { draft: { ne: true }, category: { ne: "algorithm" } } }
    ) {
      group(field: { frontmatter: { category: SELECT } }) {
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
        }
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
    allMarkdownRemark: {
      group: {
        fieldValue: string;
        totalCount: number;
      }[];
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
        rawMarkdownBody: string;
      }[];
    };
  };
}

const BlogIndex = ({ data }: Props) => {
  const posts = data.allMarkdownRemark.nodes;
  const categories = sortBy(data.allMarkdownRemark.group, [v => v.totalCount, 'desc']);

  if (posts.length === 0) {
    return (
      <p>
        No blog posts found. Add markdown posts to &quot;content/blog&quot; (or the directory you
        specified for the &quot;gatsby-source-filesystem&quot; plugin in gatsby-config.js).
      </p>
    );
  }

  return (
    <Layout>
      <VerticalSpace size={48} />
      <Bio />
      <Divider />
      <SideCategoryList categories={categories} postCount={posts.length} />
      <PostList postList={posts} />
    </Layout>
  );
};

export default BlogIndex;

export const Head = ({ data }: Props) => {
  const ogImgUrl = `${blogConfig.siteUrl}/og-img.webp`;
  const title = blogConfig.title;
  const description = blogConfig.description;
  const url = blogConfig.siteUrl;
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
