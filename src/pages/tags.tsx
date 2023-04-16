import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { graphql } from 'gatsby';

import queryString from 'query-string';

import Layout from 'components/Layout';
import Title from 'components/Title';
import TagList from 'components/TagList';
import PostList from 'components/PostList';
import VerticalSpace from 'components/VerticalSpace';

import isServer from 'utils/isServer';
import { blogConfig } from '../../blog-config';
import { sortBy } from 'remeda';

const TagListWrapper = styled.div`
  margin-top: 20px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

type Frontmatter = {
  date: string;
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
        }
      }
    }
  }
`;

const TagsPage = ({ data }: Props) => {
  const tags = sortBy(data.allMarkdownRemark.group, v => v.totalCount).reverse();
  const posts = data.allMarkdownRemark.nodes;

  const [selected, setSelected] = useState<string | undefined>();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const query = isServer() ? '' : document?.location.search;
  const q = queryString.parse(query)['q'] as string;

  useEffect(() => {
    if (!selected) {
      setFilteredPosts(posts);
      return;
    }

    setFilteredPosts(posts.filter(post => post.frontmatter.tags.indexOf(selected) !== -1));
  }, [selected, posts]);

  useEffect(() => {
    setSelected(q);
  }, [q]);

  return (
    <>
      <Layout>
        <TagListWrapper>
          {selected ? (
            <Title size="sm">
              There are {filteredPosts.length} post
              {filteredPosts.length > 1 && 's'} that match #{selected}.
            </Title>
          ) : (
            <Title size="sm">
              There are {tags.length} tag{tags.length > 1 && 's'}.
            </Title>
          )}
          <TagList count tagList={tags} selected={selected} />
        </TagListWrapper>
        <VerticalSpace size={32} />
        <PostList postList={filteredPosts} />
      </Layout>
    </>
  );
};

export default TagsPage;

export const Head = ({ data }: Props) => {
  const ogImgUrl = `${blogConfig.siteUrl}/og-img.webp`;
  const title = data.site.siteMetadata.title;
  const description = blogConfig.description;
  const url = blogConfig.siteUrl + 'tags/';
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
