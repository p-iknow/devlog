import React from 'react';
import { Helmet } from 'react-helmet';
import blogConfig from '../../../blog-config';

const SEO = ({
  title,
  description,
  url,
  ogImg = `${blogConfig.siteUrl}/og-img.jpeg`,
  keywords,
}: {
  title: string;
  description: string;
  url: string;
  ogImg?: string;
  keywords?: string[];
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={blogConfig.author} />
      {keywords && <meta name="keywords" content={keywords?.join(' ')} />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImg} />

      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:image" content={ogImg} />
    </Helmet>
  );
};

export default SEO;
