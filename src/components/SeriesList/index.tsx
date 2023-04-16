import React, { useState, useEffect, Fragment } from 'react';
import styled from 'styled-components';

import { Link } from 'gatsby';

import Title from 'components/Title';
import Divider from 'components/Divider';
import { useThrottledCallback } from '@react-hookz/web';

const SeriesListWrapper = styled.div`
  margin-bottom: 60px;
  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

const SeriesWrapper = styled.div`
  position: relative;
  top: 0;
  transition: all 0.5s;

  @media (max-width: 768px) {
    padding: 0 5px;
  }
`;

const SeriesInform = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.tertiaryText};

  & > span {
    margin: 0 5px;
  }
`;

const Date = styled.p`
  font-size: 14.4px;
`;

const PostCount = styled.p`
  font-size: 14.4px;
`;

const checkIsScrollAtBottom = () => {
  return (
    document.documentElement.scrollHeight - document.documentElement.scrollTop <=
    document.documentElement.clientHeight + 100
  );
};

interface Props {
  seriesList: {
    name: string;
    posts: {
      date: string;
      update: string;
      title: string;
      tags: string[];
      series: string;
      slug: string;
    }[];
    lastUpdated: string;
  }[];
}

const SeriesList = ({ seriesList }: Props) => {
  const [seriesCount, setSeriesCount] = useState(10);

  const handleMoreLoad = useThrottledCallback(
    () => {
      if (checkIsScrollAtBottom() && seriesCount < seriesList.length) {
        setTimeout(() => setSeriesCount(seriesCount + 10), 300);
      }
    },
    [seriesCount, setSeriesCount, seriesList],
    250
  );

  useEffect(() => {
    window.addEventListener('scroll', handleMoreLoad);

    return () => {
      window.removeEventListener('scroll', handleMoreLoad);
    };
  }, [handleMoreLoad]);

  useEffect(() => {
    setSeriesCount(10);
  }, [seriesList]);

  return (
    <SeriesListWrapper>
      {seriesList.slice(0, seriesCount).map((series, i) => {
        return (
          <Fragment key={series.name}>
            <SeriesWrapper>
              <Title size="bg">
                <Link to={`/series/${series.name.replace(/\s/g, '-')}`}>{series.name}</Link>
              </Title>
              <SeriesInform>
                <PostCount>{series.posts.length} Posts</PostCount>
                <span>·</span>
                <Date>Last updated on {series.lastUpdated}</Date>
              </SeriesInform>
            </SeriesWrapper>

            {seriesCount - 1 !== i && seriesList.length - 1 !== i && <Divider mt={48} mb={32} />}
          </Fragment>
        );
      })}
    </SeriesListWrapper>
  );
};

export default SeriesList;
