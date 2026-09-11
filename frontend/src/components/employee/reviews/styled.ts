import { Accordion } from '@mantine/core';
import styled from 'styled-components';

export const StyledAccordion = styled(Accordion as any)`
  & .mantine-Accordion-item {
    background-color: light-dark(
      var(--mantine-color-gray-0),
      var(--mantine-color-dark-6)
    );
    border-color: light-dark(
      var(--mantine-color-gray-3),
      var(--mantine-color-dark-4)
    );
  }

  & .mantine-Accordion-control:hover {
    background-color: light-dark(
      var(--mantine-color-gray-1),
      var(--mantine-color-dark-5)
    );
  }
`;
