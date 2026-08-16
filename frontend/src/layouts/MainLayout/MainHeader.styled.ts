import { UnstyledButton } from '@mantine/core';
import styled from 'styled-components';

export const NavButton = styled(UnstyledButton as any) <{ $active?: boolean }>`
  padding: 6px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${(p) => (p.$active ? 'white' : 'var(--mantine-color-blue-1)')};
  background-color: ${(p) => (p.$active ? 'var(--mantine-color-blue-7)' : 'transparent')};
  font-size: var(--mantine-font-size-sm);
  font-weight: ${(p) => (p.$active ? 600 : 400)};
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: var(--mantine-color-blue-7) !important;
    color: white !important;
  }
`;
