// TODO: Gatsby에서 타입스크립트 지원이 완벽하게 되면 아래 파일 사용할 것
import { GatsbyNode } from 'gatsby';

const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
  type MarkdownRemark implements Node {
    frontmatter: Frontmatter!
  }
  type Frontmatter {
    title: String!
    description: String
    tags: [String!]!
    series: String
  }
  `;
  createTypes(typeDefs);
};

export default createSchemaCustomization;
