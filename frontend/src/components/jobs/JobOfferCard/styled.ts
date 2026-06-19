import { Card } from '@mantine/core';
import styled from 'styled-components';

export const StyledJobCard = styled(Card as any)`
  background: light-dark(
    linear-gradient(to bottom, #ffffff 10%, #e8f4fd 100%),
    var(--mantine-color-dark-6)
  ) !important;
  border: 1px solid light-dark(#dce8f5, var(--mantine-color-dark-4)) !important;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease !important;

  &:hover {
    transform: translateY(-4px) !important;
    box-shadow:
      0 12px 24px -10px rgba(0, 0, 0, 0.15),
      0 8px 16px -8px rgba(0, 0, 0, 0.1) !important;
  }
`;
