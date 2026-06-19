import styled from 'styled-components';

export const LogoButton = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  flex-wrap: nowrap;
  flex-shrink: 0;
`;

export const LogoImage = styled.img`
  height: 50px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
  max-width: none;
`;

export const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
  color: inherit;
`;
