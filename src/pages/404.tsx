import React from 'react';
import styled from 'styled-components';

import Layout from 'components/Layout';
import { blogConfig } from '../../blog-config';

const NotFound = styled.div`
  height: 800px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.colors.tertiaryText};

  & > h2 {
    margin-bottom: 16px;
    font-weight: bold;
    font-size: 48px;
  }

  & > h3 {
    font-weight: lighter;
    font-size: 30.4px;
  }

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const NotFoundPage = () => (
  <Layout>
    <NotFound>
      <h2>페이지를 찾을 수 없습니다.</h2>
      <h3>입력하신 주소에 해당하는 페이지가 없습니다. </h3>
    </NotFound>
  </Layout>
);

export default NotFoundPage;

export const Head = () => {
  const ogImgUrl = `${blogConfig.siteUrl}/og-img.jpeg`;
  const title = `p-iknow's dev-log not found page`;
  const description = title;
  const url = blogConfig.siteUrl + '404/';
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content={blogConfig.author} />

      {/* Facebook Meta Tags */}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImgUrl} />
      {/*  Twitter Meta Tags  */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="p-iknow.netlify.app" />
      <meta property="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImgUrl} />
      <meta name="twitter:label1" content="Category" />
      <meta name="twitter:data1" content="개발" />
    </>
  );
};
