import React from 'react';
import { Helmet } from 'react-helmet';
import blogConfig from '../../../blog-config';

const SEO = ({ title, description, url }: { title: string; description: string; url: string }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={`${blogConfig.siteUrl}/og-image.jpeg`} />
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
    </Helmet>
  );
};

export default SEO;
