import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "blue",
  defaultRadius: "md",
  fontFamily: "Inter, sans-serif",
  fontSizes: {
    xs: '0.625rem',  // 10px
    sm: '0.75rem',   // 12px
    md: '0.8125rem',  // 13px
    lg: '0.875rem',   // 14px
    xl: '1rem',      // 16px
  },
  headings: {
    sizes: {
      h1: { fontSize: '1.625rem' },  // 26px
      h2: { fontSize: '1.375rem' },  // 22px
      h3: { fontSize: '1.125rem' },  // 18px
      h4: { fontSize: '1rem' },      // 16px
      h5: { fontSize: '0.875rem' },  // 14px
      h6: { fontSize: '0.8125rem' }, // 13px
    },
  },
});
