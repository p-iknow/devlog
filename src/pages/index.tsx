import React from 'react';
import _ from 'lodash';
import { graphql } from 'gatsby';

import Layout from 'components/Layout';
import SEO from 'containers/SEO';
import Bio from 'components/Bio';
import PostList from 'components/PostList';
import SideTagList from 'components/SideTagList';
import Divider from 'components/Divider';
import VerticalSpace from 'components/VerticalSpace';

import blogConfig from '../../blog-config';

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
  const tags = _.sortBy(data.allMarkdownRemark.group, ['totalCount']).reverse();

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
      <SEO title={blogConfig.title} description={blogConfig.description} url={blogConfig.siteUrl} />
      <VerticalSpace size={48} />
      <Bio />
      <Divider />
      <SideTagList tags={tags} postCount={posts.length} />
      <PostList postList={posts} />
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }

    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
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
          date
          update
          title
          tags
        }
      }
    }
  }
`;
