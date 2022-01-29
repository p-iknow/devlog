const { title, description } = {
  title: 'hoodie',
  description: "Hello :) I'm Hudi who developed gatsby-starter-hoodie theme.",
  author: 'Hudi',
  siteUrl: 'https://devhudi.github.io/gatsby-starter-hoodie/',
  links: {
    github: 'https://github.com/devHudi',
    linkedIn: 'https://linkedin.com',
    facebook: 'https://www.facebook.com',
    instagram: 'https://www.instagram.com',
    email: 'mailto:devhudi@gmail.com',
  },
  utterances: {
    repo: 'devHudi/gatsby-starter-hoodie',
    type: 'pathname',
  },
};

module.exports = {
  siteMetadata: {
    title: `p-iknow's dev-log`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
    'gatsby-plugin-styled-components',
    'gatsby-plugin-react-helmet',
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-robots-txt`,
    `gatsby-plugin-resolve-src`,
    'gatsby-plugin-sitemap',
    'gatsby-plugin-image',
    'gatsby-plugin-mdx',
    'gatsby-transformer-remark',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true, // defaults to false
        allExtensions: true, // defaults to false
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `noto sans kr:300,400,500,700,900`,
          `source code pro:700`, // you can also specify font weights and styles
        ],
        display: 'swap',
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'G-82GQNE95K7',
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: title,
        short_name: title,
        description: description,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#ced4da`,
        display: `standalone`,
        icon: `static/favicon.png`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/',
      },
      __key: 'images',
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/contents/posts`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        footnotes: true,
        gfm: true,
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 680,
              loading: 'lazy',
              wrapperStyle: 'margin-bottom: 16px;',
              quality: 100,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
              languageExtensions: [
                {
                  language: 'superscript',
                  extend: 'javascript',
                  definition: {
                    superscript_types: /(SuperType)/,
                  },
                  insertBefore: {
                    function: {
                      superscript_keywords: /(superif|superelse)/,
                    },
                  },
                },
              ],
              prompt: {
                user: 'root',
                host: 'localhost',
                global: false,
              },
              escapeEntities: {},
            },
          },
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `ignore`,
            },
          },
          {
            resolve: 'gatsby-remark-static-images',
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ 'content:encoded': edge.node.html }],
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: `/rss.xml`,
            title: `RSS Feed of ${title}`,
            match: '^/blog/',
          },
        ],
      },
    },
  ],
};
