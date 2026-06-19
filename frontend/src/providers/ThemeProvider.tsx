import React from "react";
import {
  MantineProvider,
  useMantineColorScheme,
} from "@mantine/core";
import { theme } from "../styles/theme";
import { useAppStore } from "../store/useAppStore";

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
  const user = useAppStore((state) => state.user);

  return (
    <MantineProvider 
      theme={theme} 
      defaultColorScheme="light"
      forceColorScheme={user ? undefined : 'light'}
    >
      {children}
    </MantineProvider>
  );
};
