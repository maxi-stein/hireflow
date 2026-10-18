import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
  fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  headings: {
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    fontWeight: '700',
    sizes: {
      h1: { fontSize: '2.25rem', lineHeight: '1.2' },
      h2: { fontSize: '1.75rem', lineHeight: '1.25' },
      h3: { fontSize: '1.375rem', lineHeight: '1.3' },
      h4: { fontSize: '1.15rem', lineHeight: '1.35' },
      h5: { fontSize: '1rem', lineHeight: '1.4' },
      h6: { fontSize: '0.875rem', lineHeight: '1.4' },
    },
  },
  components: {
    Card: {
      defaultProps: {
        radius: 'lg',
      },
      styles: {
        root: {
          borderColor: 'light-dark(#e2e8f0, #334155)',
          transition: 'all 0.2s ease',
        },
      },
    },
    Paper: {
      defaultProps: {
        radius: 'lg',
      },
      styles: {
        root: {
          borderColor: 'light-dark(#e2e8f0, #334155)',
        },
      },
    },
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        },
      },
    },
    TextInput: {
      styles: {
        input: {
          backgroundColor: 'light-dark(#ffffff, #1e293b)',
          borderColor: 'light-dark(#cbd5e1, #334155)',
          color: 'light-dark(#0f172a, #f8fafc)',
          borderRadius: '8px',
          '&:focus': {
            borderColor: '#2563eb',
          },
        },
      },
    },
    PasswordInput: {
      styles: {
        input: {
          backgroundColor: 'light-dark(#ffffff, #1e293b)',
          borderColor: 'light-dark(#cbd5e1, #334155)',
          color: 'light-dark(#0f172a, #f8fafc)',
          borderRadius: '8px',
          '&:focus': {
            borderColor: '#2563eb',
          },
        },
      },
    },
    Modal: {
      defaultProps: {
        radius: 'xl',
      },
      styles: {
        content: {
          backgroundColor: 'light-dark(#ffffff, #0f172a)',
          borderColor: 'light-dark(#e2e8f0, #334155)',
        },
        header: {
          backgroundColor: 'light-dark(#ffffff, #0f172a)',
        },
      },
    },
    SegmentedControl: {
      styles: {
        root: {
          backgroundColor: 'light-dark(#f1f5f9, #0f172a)',
          border: '1px solid light-dark(#e2e8f0, #334155)',
        },
        indicator: {
          backgroundColor: 'light-dark(#ffffff, #1e293b)',
        },
      },
    },
    Badge: {
      styles: {
        root: {
          fontWeight: 600,
          letterSpacing: '0.01em',
        },
      },
    },
  },
});
