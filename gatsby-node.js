const { createFilePath } = require(`gatsby-source-filesystem`);
const { decamelize } = require('humps');

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      postsRemark: allMarkdownRemark(
        sort: { frontmatter: { date: ASC } }
        filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
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
        group(field: { frontmatter: { tags: SELECT } }) {
          fieldValue
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(`There was an error loading your blog posts`, result.errors);
    return;
  }

  const posts = result.data.postsRemark.nodes;
  if (posts.length > 0) {
    const postTemplate = require.resolve(`./src/templates/Post.tsx`);
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

  const series = posts.reduce((acc, cur) => {
    const seriesName = cur.frontmatter.series;
    if (seriesName && !acc.includes(seriesName)) return [...acc, seriesName];
    return acc;
  }, []);
  if (series.length > 0) {
    const seriesTemplate = require.resolve(`./src/templates/Series.tsx`);
    series.forEach(singleSeries => {
      const path = `/series/${singleSeries.replace(/\s/g, '-')}`;
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

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'MarkdownRemark') {
    if (typeof node.frontmatter.slug !== 'undefined') {
      const { slug } = node.frontmatter;
      const value = slug.startsWith('/') ? slug : `/${slug}`;
      createNodeField({
        node,
        name: 'slug',
        value,
      });
    } else {
      const value = createFilePath({ node, getNode });
      createNodeField({
        node,
        name: 'slug',
        value,
      });
    }

    if (node.frontmatter.tags) {
      const tagSlugs = node.frontmatter.tags.map(
        tag => `/tag/${decamelize(tag, { separator: '-' })}/`
      );
      createNodeField({ node, name: 'tagSlugs', value: tagSlugs });
    }

    if (node.frontmatter.category) {
      const categorySlug = `/category/${decamelize(node.frontmatter.category, {
        separator: '-',
      })}/`;
      createNodeField({ node, name: 'categorySlug', value: categorySlug });
    }

    if (node.frontmatter.img) {
      createNodeField({ node, name: 'ogImg', value: node.frontmatter.img });
    }
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
  type MarkdownRemark implements Node {
    frontmatter: Frontmatter!
  }
  type Frontmatter {
    title: String!
    description: String!
    date: Date! @dateformat(formatString: "YYYY-MM-DD")
    update: Date @dateformat(formatString: "YYYY-MM-DD")
    template: String!
    draft: Boolean!
    slug: String
    category: String
    tags: [String!]!
    series: String
    img: String
  }
  `;
  createTypes(typeDefs);
};
