import { NavLink } from '@mantine/core';
import styled from 'styled-components';

export const StyledNavLink = styled(NavLink as any)`
  border-radius: 10px;

  &:hover {
    background-color: var(--mantine-color-blue-7) !important;
  }
`;
