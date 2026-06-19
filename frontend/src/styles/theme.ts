import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
  fontFamily: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
  fontSizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    md: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
  },
  headings: {
    sizes: {
      h1: { fontSize: '1.625rem' }, // 26px
      h2: { fontSize: '1.375rem' }, // 22px
      h3: { fontSize: '1.125rem' }, // 18px
      h4: { fontSize: '1rem' }, // 16px
      h5: { fontSize: '0.875rem' }, // 14px
      h6: { fontSize: '0.8125rem' }, // 13px
    },
  },
  components: {
    Card: {
      styles: {
        root: {
          borderColor:
            'light-dark(var(--mantine-color-blue-1), var(--mantine-color-default-border))',
          borderRadius: '1.2rem',
        },
      },
    },
    Paper: {
      styles: {
        root: {
          borderColor:
            'light-dark(var(--mantine-color-blue-1), var(--mantine-color-default-border))',
          borderRadius: '1.2rem',
        },
      },
    },
    Input: {
      styles: {
        input: {
          borderColor:
            'light-dark(var(--mantine-color-blue-1), var(--mantine-color-default-border))',
        },
      },
    },
  },
});
