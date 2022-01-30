// TODO: Gatsby에서 타입스크립트 지원이 완벽하게 되면 아래 파일 사용할 것

import { GatsbyNode } from 'gatsby';
import { createFilePath } from 'gatsby-source-filesystem';
import _ from 'lodash';

export type TypeFrontmatter = {
  title: string;
  date: Date;
  update: Date;
  template: string;
  draft: boolean;
  slug: string;
  category: string;
  tags: string[];
  description?: string;
  img?: string;
};

export const onCreateNode: GatsbyNode['onCreateNode'] = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  node;

  if (node.internal.type === 'MarkdownRemark') {
    const frontmatter = node.frontmatter as TypeFrontmatter;
    if (typeof frontmatter.slug !== 'undefined') {
      createNodeField({
        node,
        name: 'slug',
        value: frontmatter.slug,
      });
    } else {
      const value = createFilePath({ node, getNode });
      createNodeField({
        node,
        name: 'slug',
        value,
      });
    }

    if (frontmatter.tags) {
      const tagSlugs = frontmatter.tags.map(tag => `/tag/${_.kebabCase(tag)}/`);
      createNodeField({ node, name: 'tagSlugs', value: tagSlugs });
    }

    if (frontmatter.category) {
      const categorySlug = `/category/${_.kebabCase(frontmatter.category)}/`;
      createNodeField({ node, name: 'categorySlug', value: categorySlug });
    }

    if (frontmatter.img) {
      createNodeField({ node, name: 'ogImg', value: frontmatter.img });
    }
  }
};
