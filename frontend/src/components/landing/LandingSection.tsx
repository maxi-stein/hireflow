import { Box, Container } from '@mantine/core';
import type { ReactNode } from 'react';
import { APP_MAX_WIDTH } from '../../constants/layout';

interface LandingSectionProps {
  children: ReactNode;
  style?: React.CSSProperties;
  noContainer?: boolean;
}

export const LandingSection = ({ children, style, noContainer = false }: LandingSectionProps) => {
  return (
    <Box
      style={{
        backgroundColor: 'oklch(99% .005 240)',
        borderBottom: '1px solid oklch(92% .02 235)',
        marginLeft: 'calc(-1 * var(--mantine-spacing-md))',
        marginRight: 'calc(-1 * var(--mantine-spacing-md))',
        width: 'calc(100% + 2 * var(--mantine-spacing-md))',
        ...style,
      }}
    >
      {noContainer ? (
        children
      ) : (
        <Container size={APP_MAX_WIDTH} py={{ base: 40, md: 80 }}>
          {children}
        </Container>
      )}
    </Box>
  );
};
