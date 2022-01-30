// TODO: Gatsby에서 타입스크립트 지원이 완벽하게 되면 아래 파일 사용할 것

import { GatsbyNode } from 'gatsby';
import _ from 'lodash';

type TypePost = {
  id: string;
  fields: {
    slug: string;
  };
  frontmatter: {
    series: string | null;
  };
};
type TypeTagGroup = { fieldValue: string }[];

type TypeData = {
  postsRemark: {
    nodes: TypePost[];
  };
  tagsGroup: {
    group: TypeTagGroup[];
  };
};

const createPages: GatsbyNode['createPages'] = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const postTemplate = require.resolve(`./src/templates/Post.tsx`);
  const seriesTemplate = require.resolve(`./src/templates/Series.tsx`);

  const result = await graphql<TypeData>(`
    {
      postsRemark: allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: ASC }
        limit: 1000
      ) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            series
          }
        }
      }
      tagsGroup: allMarkdownRemark(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(`There was an error loading your blog posts`, result.errors as Error);
    return;
  }

  const posts = (result?.data?.postsRemark.nodes as TypePost[]) ?? [];
  const series = _.reduce(
    posts,
    (acc, cur) => {
      const seriesName = cur.frontmatter.series;
      if (seriesName && !_.includes(acc, seriesName)) return [...acc, seriesName];
      return acc;
    },
    [] as string[]
  );

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id;
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id;

      createPage({
        path: post.fields.slug,
        component: postTemplate,
        context: {
          id: post.id,
          series: post.frontmatter.series,
          previousPostId,
          nextPostId,
        },
      });
    });
  }

  if (series.length > 0) {
    series.forEach(singleSeries => {
      const path = `/series/${_.replace(singleSeries, /\s/g, '-')}`;
      createPage({
        path,
        component: seriesTemplate,
        context: {
          series: singleSeries,
        },
      });
    });
  }
};

export default createPages;
