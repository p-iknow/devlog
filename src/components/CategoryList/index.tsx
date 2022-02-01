import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

const CategoryListWrapper = styled.div`
  margin-bottom: 16px;
  word-break: break-all;
`;

const CategoryLink = styled.div<{ selected?: boolean }>`
  display: inline-block;
  padding: 9.6px 11.2px;
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 50px;
  background-color: ${props =>
    props.selected ? props.theme.colors.selectedTagBackground : props.theme.colors.tagBackground};
  color: ${props =>
    props.selected ? props.theme.colors.selectedTagText : props.theme.colors.tagText};
  text-decoration: none;
  font-size: 14.4px;
  transition: all 0.2s;

  &:hover {
    background-color: ${props =>
      props.selected
        ? props.theme.colors.hoveredSelectedTagBackground
        : props.theme.colors.hoveredTagBackground};
  }
`;

const spaceToDash = (text: string) => {
  return text.replace(/\s+/g, '-');
};
type Props =
  | {
      count: true;
      categories: { fieldValue: string; totalCount: number }[];
      selected?: string;
    }
  | {
      count?: undefined;
      categories: string[];
      selected?: undefined;
    };

const CategoryList = (props: Props) => {
  if (props?.count) {
    return (
      <CategoryListWrapper>
        {props.categories.map((tag, i) => (
          <Link
            key={JSON.stringify({ tag, i })}
            to={
              props.selected === tag.fieldValue ? '/categories' : `/categories?q=${tag.fieldValue}`
            }
          >
            <CategoryLink selected={tag.fieldValue === props.selected}>
              {spaceToDash(tag.fieldValue)} ({tag.totalCount})
            </CategoryLink>
          </Link>
        ))}
      </CategoryListWrapper>
    );
  }

  return (
    <CategoryListWrapper>
      {props.categories.map((tag, i) => (
        <Link key={JSON.stringify({ tag, i })} to={`/categories?q=${tag}`}>
          <CategoryLink>{spaceToDash(tag)}</CategoryLink>
        </Link>
      ))}
    </CategoryListWrapper>
  );
};

export default CategoryList;
