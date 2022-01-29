import styled from 'styled-components';

const Divider = styled.hr<{ mt?: number; mb?: number }>`
  margin-top: ${({ mt = 48 }) => mt}px;
  margin-bottom: ${({ mb = 48 }) => mb}px;
  border: none;
  border-bottom: 1px solid ${props => props.theme.colors.divider};
`;

export default Divider;
