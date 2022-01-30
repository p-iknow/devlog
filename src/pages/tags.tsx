import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import SEO from 'containers/SEO';
import filter from 'lodash/filter';

import { graphql } from 'gatsby';

import queryString from 'query-string';

import Layout from 'components/Layout';
import Title from 'components/Title';
import TagList from 'components/TagList';
import PostList from 'components/PostList';
import VerticalSpace from 'components/VerticalSpace';

import blogConfig from '../../blog-config';

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

const TagsPage = ({ data }: Props) => {
  const tags = _.sortBy(data.allMarkdownRemark.group, ['totalCount']).reverse();
  const posts = data.allMarkdownRemark.nodes;

  const [selected, setSelected] = useState<string | undefined>();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const query = document.location.search;
  const q = queryString.parse(query)['q'] as string;

  useEffect(() => {
    if (!selected) {
      setFilteredPosts(posts);
      return;
    }

    setFilteredPosts(filter(posts, post => post.frontmatter.tags.indexOf(selected) !== -1));
  }, [selected, posts]);

  useEffect(() => {
    setSelected(q);
  }, [q]);

  return (
    <Layout>
      <SEO title={blogConfig.title} description={blogConfig.description} url={blogConfig.siteUrl} />

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
  );
};

export default TagsPage;

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
        }
      }
    }
  }
`;
