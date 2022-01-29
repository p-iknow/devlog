import { Link } from 'gatsby';
import React from 'react';

const Header = ({ siteTitle = '' }: { siteTitle?: string }) => (
  <header
    style={{
      background: `rebeccapurple`,
      marginBottom: `23.2px`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `23.2px 17.4px`,
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
  </header>
);

export default Header;
