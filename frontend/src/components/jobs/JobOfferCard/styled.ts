import { Card } from '@mantine/core';
import styled from 'styled-components';

export const StyledJobCard = styled(Card as any)`
  background: #ffffff;
  border: 1px solid #e2e8f0 !important;
  border-radius: 16px !important;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02) !important;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease !important;
  display: flex;
  flex-direction: column;
  height: 100%;

  [data-mantine-color-scheme='dark'] & {
    background: #1e293b;
    border-color: #334155 !important;
  }

  &:hover {
    transform: translateY(-4px) !important;
    border-color: #93c5fd !important;
    box-shadow: 0 16px 30px -10px rgba(37, 99, 235, 0.12), 0 8px 16px -6px rgba(15, 23, 42, 0.06) !important;
  }
`;
