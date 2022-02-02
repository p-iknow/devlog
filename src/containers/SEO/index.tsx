import React from 'react';
import { Helmet } from 'react-helmet';
import blogConfig from '../../../blog-config';

const SEO = ({
  title,
  description,
  url,
  ogImg,
}: {
  title: string;
  description: string;
  url: string;
  ogImg?: string;
}) => {
  const ogImgUrl = ogImg ?? `${blogConfig.siteUrl}/og-image.jpeg`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={ogImgUrl} />
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
    </Helmet>
  );
};

export default SEO;
