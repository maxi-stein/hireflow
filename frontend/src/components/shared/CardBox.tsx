import { Box, type BoxProps } from '@mantine/core';
import type { ReactNode } from 'react';

export const CARD_BORDER_DARK = '#334155';
export const CARD_BORDER_LIGHT = '#e2e8f0';

interface CardBoxProps extends BoxProps {
  isDark: boolean;
  // 'gradient' for widgets
  // 'flat' default
  variant?: 'flat' | 'gradient';
  children: ReactNode;
}


export function CardBox({
  isDark,
  variant = 'flat',
  children,
  style,
  ...rest
}: CardBoxProps) {
  const background = isDark
    ? variant === 'gradient'
      ? 'linear-gradient(160deg, #1e293b 0%, #0f172a 100%)'
      : '#1e293b'
    : '#ffffff';

  return (
    <Box
      style={{
        borderRadius: 16,
        border: `1px solid ${isDark ? CARD_BORDER_DARK : CARD_BORDER_LIGHT}`,
        background,
        boxShadow: isDark
          ? '0 4px 20px rgba(0,0,0,0.3)'
          : '0 4px 20px rgba(15,23,42,0.05)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}
