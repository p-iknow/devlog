export interface WebsiteConfig {
  title: string;
  description: string;
  author: string;
  siteUrl: string;
  links: {
    github: string;
    linkedIn: string;
    facebook: string;
    instagram: string;
    email: string;
  };
  utterances: {
    repo: string;
    type: string;
  };
}

const config: WebsiteConfig = {
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

export default config;
