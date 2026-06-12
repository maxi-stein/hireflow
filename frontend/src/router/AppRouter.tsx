import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { DynamicLayout } from "../layouts/DynamicLayout";
import { ErrorPage } from "../pages/ErrorPage";
import { ROUTES } from "./routes.config";

export const router = createBrowserRouter([
  // Login page - standalone without layout
  {
    path: ROUTES.PUBLIC.LOGIN.path,
    element: ROUTES.PUBLIC.LOGIN.element,
    errorElement: <ErrorPage />,
  },

  // Register page - standalone without layout
  {
    path: ROUTES.PUBLIC.REGISTER.path,
    element: ROUTES.PUBLIC.REGISTER.element,
    errorElement: <ErrorPage />,
  },

  // Main App Structure - DynamicLayout persists across navigation
  {
    element: <DynamicLayout />,
    errorElement: <ErrorPage />,
    children: [
      // Public routes
      {
        path: ROUTES.PUBLIC.HOME.path,
        element: ROUTES.PUBLIC.HOME.element,
      },
      {
        path: ROUTES.PUBLIC.JOBS.path,
        element: ROUTES.PUBLIC.JOBS.element,
      },
      {
        path: ROUTES.PUBLIC.JOB_DETAIL.path,
        element: ROUTES.PUBLIC.JOB_DETAIL.element,
      },

      // Protected routes
      {
        element: <ProtectedRoute allowedRoles={["candidate", "employee"]} />,
        children: [
          // Common routes (both candidate and employee)
          {
            path: ROUTES.COMMON.PROFILE.path,
            element: ROUTES.COMMON.PROFILE.element,
          },

          // Candidate-only routes
          {
            element: <ProtectedRoute allowedRoles={["candidate"]} />,
            children: [
              {
                path: ROUTES.CANDIDATE.APPLICATIONS.path,
                element: ROUTES.CANDIDATE.APPLICATIONS.element,
              },
              {
                path: ROUTES.CANDIDATE.JOB_APPLY.path,
                element: ROUTES.CANDIDATE.JOB_APPLY.element,
              },
            ],
          },

          // Employee-only routes
          {
            element: <ProtectedRoute allowedRoles={["employee"]} />,
            children: [
              {
                path: ROUTES.EMPLOYEE.DASHBOARD.path,
                element: ROUTES.EMPLOYEE.DASHBOARD.element,
              },
              {
                path: ROUTES.EMPLOYEE.REGISTER_EMPLOYEE.path,
                element: ROUTES.EMPLOYEE.REGISTER_EMPLOYEE.element,
              },
              // Job Postings Group
              ...(ROUTES.EMPLOYEE.JOB_POSTINGS_GROUP.children || []).map(route => ({
                path: route.path,
                element: route.element,
              })),

              // Candidates Group
              ...(ROUTES.EMPLOYEE.CANDIDATES_GROUP.children || []).map(route => ({
                path: route.path,
                element: route.element,
              })),

              // Interviews Group
              ...(ROUTES.EMPLOYEE.INTERVIEWS_GROUP.children || []).map(route => ({
                path: route.path,
                element: route.element,
              })),
            ],
          },
        ],
      },
    ],
  },

  // Catch-all redirect
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
