import styled from '@emotion/styled';
import { Select } from '@mantine/core';

export const StyledSelect = styled(Select)`
  .mantine-Select-input:disabled {
    opacity: 1;
    color: var(--mantine-color-text);
    cursor: not-allowed;
  }
`;
