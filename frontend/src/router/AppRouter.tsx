import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainLayout } from "../layouts/MainLayout";
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
  
  // Public routes with DynamicLayout (shows MainLayout if logged in, PublicLayout if not)
  {
    element: <DynamicLayout />,
    errorElement: <ErrorPage />,
    children: [
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
    ],
  },
  
  // Protected routes for authenticated users
  {
    element: <ProtectedRoute allowedRoles={["candidate", "employee"]} />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <MainLayout />,
        children: [
          // Common routes (both candidate and employee)
          {
            path: ROUTES.COMMON.PROFILE.path,
            element: ROUTES.COMMON.PROFILE.element,
          },
          {
            path: ROUTES.COMMON.SETTINGS.path,
            element: ROUTES.COMMON.SETTINGS.element,
          },
          
          // Candidate-only routes
          {
            element: <ProtectedRoute allowedRoles={["candidate"]} />,
            children: [
              {
                path: ROUTES.CANDIDATE.APPLICATIONS.path,
                element: ROUTES.CANDIDATE.APPLICATIONS.element,
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
                path: ROUTES.EMPLOYEE.JOB_POSTINGS_GROUP.children[0].path,
                element: ROUTES.EMPLOYEE.JOB_POSTINGS_GROUP.children[0].element,
              },
              {
                path: ROUTES.EMPLOYEE.JOB_POSTINGS_GROUP.children[1].path,
                element: ROUTES.EMPLOYEE.JOB_POSTINGS_GROUP.children[1].element,
              },
              {
                path: ROUTES.EMPLOYEE.JOB_POSTINGS_GROUP.children[2].path,
                element: ROUTES.EMPLOYEE.JOB_POSTINGS_GROUP.children[2].element,
              },
              {
                path: ROUTES.EMPLOYEE.CANDIDATES.path,
                element: ROUTES.EMPLOYEE.CANDIDATES.element,
              },
              {
                path: ROUTES.EMPLOYEE.COMPARE_CANDIDATES.path,
                element: ROUTES.EMPLOYEE.COMPARE_CANDIDATES.element,
              },
              {
                path: ROUTES.EMPLOYEE.INTERVIEWS.path,
                element: ROUTES.EMPLOYEE.INTERVIEWS.element,
              },
            ],
          },
        ],
      },
    ],
  },
  
  // Catch-all redirect
  {
    path: "*",
    element: <Navigate to={ROUTES.PUBLIC.HOME.path} replace />,
  },
]);
