import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "./index.css";
import { QueryProvider } from "./providers/QueryProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Notifications } from "@mantine/notifications";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/AppRouter";
import { authEvents } from "./services/auth-events";

// Setup global auth event listener
authEvents.onUnauthorized = () => {
  router.navigate("/login");
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <Notifications />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>
);
