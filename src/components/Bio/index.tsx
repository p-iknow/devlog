import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { FaGithub, FaFacebook, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';
import { blogConfig } from '../../../blog-config';

const BioWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

const profileImageRoot =
  typeof window !== 'undefined' && window.location.host === 'localhost:8000'
    ? 'http://localhost:8000'
    : blogConfig.siteUrl;

const Profile = styled.img`
  flex: 0 0 auto;
  margin-right: 16px;
  width: 128px;
  height: 128px;
  border-radius: 999px;
  background-image: url(${profileImageRoot}/profile.webp);
  background-size: cover;
  background-position: center;
`;

const Author = styled.div`
  margin-bottom: 4.8px;
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const Description = styled.div`
  margin-bottom: 11.2px;
  line-height: 1.5;
  font-size: 16px;
  color: ${props => props.theme.colors.secondaryText};
`;

const LinksWrapper = styled.div`
  & a {
    margin-right: 9.6px;
  }

  & svg {
    width: 25.6px;
    height: 25.6px;
    cursor: pointer;
  }

  & svg path {
    fill: ${props => props.theme.colors.icon};
    transition: fill 0.3s;
  }

  & a:hover svg path {
    fill: ${props => props.theme.colors.text};
  }
`;

interface Props {
  link: string;
  children: ReactNode;
}
const Link = ({ link, children }: Props) => {
  if (!link) return null;
  return (
    <a href={link} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
};

const Bio = () => {
  const { github, instagram, facebook, linkedIn, email } = blogConfig.links;

  return (
    <BioWrapper id="bio">
      <Profile />
      <div>
        <Author>@{blogConfig.author}</Author>
        <Description>{blogConfig.description}</Description>
        <LinksWrapper>
          <Link link={github}>
            <FaGithub />
          </Link>
          <Link link={instagram}>
            <FaInstagram />
          </Link>
          <Link link={facebook}>
            <FaFacebook />
          </Link>
          <Link link={linkedIn}>
            <FaLinkedin />
          </Link>
          <Link link={email}>
            <FaEnvelope />
          </Link>
        </LinksWrapper>
      </div>
    </BioWrapper>
  );
};

export default Bio;
