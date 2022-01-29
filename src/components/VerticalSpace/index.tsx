import styled from 'styled-components';

const VerticalSpace = styled.div<{ size: number }>`
  height: ${props => props.size}px;
`;

export default VerticalSpace;
