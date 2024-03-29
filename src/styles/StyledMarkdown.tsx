import styled from 'styled-components';

const StyledMarkdown = styled.div`
  & {
    font-size: 16.7px;
    color: ${props => props.theme.colors.text};
    line-height: 1.7;
    overflow: hidden;
  }

  & *:first-child {
    margin-top: 0;
  }

  & > p,
  & > ul,
  & > ol,
  & table,
  & blockquote,
  & pre,
  & img,
  & .katex-display {
    margin-top: 0;
    margin-bottom: 24px;
  }

  & p {
    word-break: break-all;

    ::-webkit-scrollbar {
      display: none;
    }
  }

  & p + h2,
  & p + h3,
  & P + h4 {
    margin-top: 2rem;
    margin-bottom: 0.9rem;
    font-weight: 700;
  }

  & h2 {
    font-size: 28px;
  }

  & h3 {
    margin-top: 48px;
    font-size: 22.4px;
  }

  & h4 {
    margin-top: 32px;
    font-size: 17.6px;
  }

  & h5 {
    font-size: 16px;
  }

  & h6 {
    font-size: 14.4px;
  }

  & strong {
    font-weight: 700;
  }

  & em {
    font-style: italic;
  }

  & blockquote {
    padding: 18px 24px;
    border-left: 4px solid ${props => props.theme.colors.blockQuoteBorder};
    background-color: ${props => props.theme.colors.blockQuoteBackground};

    & *:last-child {
      margin-bottom: 0;
    }
  }

  & blockquote blockquote {
    margin-top: 24px;
  }

  & table {
    border-collapse: collapse;
  }

  & th {
    border-bottom: 2px solid ${props => props.theme.colors.border};
    font-weight: 700;
  }

  & td {
    border-top: 1px solid ${props => props.theme.colors.border};
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  & td,
  th {
    padding: 8px;
  }

  & tr:first-child td {
    border-top: none;
  }

  & tr:nth-child(even) {
    background-color: ${props => props.theme.colors.tableBackground};
  }

  & tr:last-child td {
    border-bottom: none;
  }

  & p > code {
    word-break: break-all;
  }

  & ul,
  & ol {
    padding-left: 32px;
  }

  & ol {
    list-style: decimal;
  }

  & ul {
    list-style: disc;
  }

  & ul ul {
    list-style: circle;
  }

  & ul ul ul {
    list-style: square;
  }

  & li {
    margin-bottom: 12.8px;
  }

  & li p {
    margin-top: 8px;
  }

  & pre {
    ::-webkit-scrollbar {
      height: 12px;
    }
    ::-webkit-scrollbar-track {
      background: ${props => props.theme.colors.scrollTrack};
    }

    ::-webkit-scrollbar-thumb {
      background: ${props => props.theme.colors.scrollHandle};
    }
  }

  & pre > code {
    font-size: 14.4px;
  }

  & img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
  }
  & p > img {
    margin-top: 0;
    margin-bottom: 0;
  }

  & p > * + img {
    margin-top: 16px;
    margin-bottom: 16px;
  }

  & hr {
    border: none;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  & a {
    padding: 1.6px 0;
    color: ${props => props.theme.colors.text};
  }

  & a:hover {
    background-color: ${props => props.theme.colors.text};
    color: ${props => props.theme.colors.hoveredLinkText};
  }

  & a:has(> code) {
    text-decoration: none;
  }
`;

export default StyledMarkdown;
