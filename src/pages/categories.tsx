import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import SEO from 'containers/SEO';

import { graphql } from 'gatsby';

import queryString from 'query-string';

import Layout from 'components/Layout';
import Title from 'components/Title';
import PostList from 'components/PostList';
import VerticalSpace from 'components/VerticalSpace';

import blogConfig from '../../blog-config';
import CategoryList from 'components/CategoryList';
import isServer from 'utils/isServer';

const CategoryListWrapper = styled.div`
  margin-top: 20px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

type Frontmatter = {
  date: string;
  update: string;
  title: string;
  category: string;
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

const CategoriesPage = ({ data }: Props) => {
  const categories = _.orderBy(data.allMarkdownRemark.group, ['totalCount'], ['desc']);
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

    setFilteredPosts(posts.filter(post => post.frontmatter.category === selected));
  }, [selected, posts]);

  useEffect(() => {
    setSelected(q);
  }, [q]);

  return (
    <Layout>
      <SEO title={blogConfig.title} description={blogConfig.description} url={blogConfig.siteUrl} />

      <CategoryListWrapper>
        {selected ? (
          <Title size="sm">
            There are {filteredPosts.length} post
            {filteredPosts.length > 1 && 's'} that match #{selected}.
          </Title>
        ) : (
          <Title size="sm">
            There are {categories.length} {categories.length > 1 ? 'categories' : 'category'}.
          </Title>
        )}

        <CategoryList count categories={categories} selected={selected} />
      </CategoryListWrapper>
      <VerticalSpace size={32} />
      <PostList postList={filteredPosts} />
    </Layout>
  );
};

export default CategoriesPage;

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
      group(field: frontmatter___category) {
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
          category
          tags
        }
      }
    }
  }
`;
