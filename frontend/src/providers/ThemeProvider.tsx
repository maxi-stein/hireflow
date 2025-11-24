import React from "react";
import {
  MantineProvider,
  useMantineColorScheme,
} from "@mantine/core";
import { theme } from "../styles/theme";

export const useTheme = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  
  return {
    toggleTheme: toggleColorScheme,
    mode: colorScheme,
  };
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      {children}
    </MantineProvider>
  );
};
