import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
  fontFamily: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
  fontSizes: {
    xs: '0.9375rem', // 15px
    sm: '1.0625rem',  // 17px
    md: '1.1875rem',  // 19px
    lg: '1.25rem',    // 20px
    xl: '1.5rem',     // 24px
  },
  headings: {
    sizes: {
      h1: { fontSize: '1.75rem' }, // 28px
      h2: { fontSize: '1.5rem' }, // 24px
      h3: { fontSize: '1.25rem' }, // 20px
      h4: { fontSize: '1.0625rem' }, // 17px
      h5: { fontSize: '0.9375rem' }, // 15px
      h6: { fontSize: '0.875rem' }, // 14px
    },
  },
  components: {
    Card: {
      styles: {
        root: {
          borderColor:
            'light-dark(var(--mantine-color-blue-1), var(--mantine-color-default-border))',
          borderRadius: '1.2rem',
          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.12), 0 2px 8px rgba(125, 211, 252, 0.08)',
        },
      },
    },
    Paper: {
      styles: {
        root: {
          borderColor:
            'light-dark(var(--mantine-color-blue-1), var(--mantine-color-default-border))',
          borderRadius: '1.2rem',
          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.12), 0 2px 8px rgba(125, 211, 252, 0.08)',
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
