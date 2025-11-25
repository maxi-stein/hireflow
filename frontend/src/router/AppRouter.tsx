import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { JobListPage } from "../pages/jobs/JobListPage";
import { JobDetailPage } from "../pages/jobs/JobDetailPage";
import { ProfilePage } from "../pages/profile/ProfilePage";
import { ApplicationsPage } from "../pages/candidate/ApplicationsPage";
import { EmployeeDashboard } from "../pages/employee/EmployeeDashboard";
import { JobPostingsPage } from "../pages/employee/JobPostingsPage";
import { CreateJobPage } from "../pages/employee/CreateJobPage";
import { CandidatesPage } from "../pages/employee/CandidatesPage";
import { CompareCandidatesPage } from "../pages/employee/CompareCandidatesPage";
import { InterviewsPage } from "../pages/employee/InterviewsPage";
import { SettingsPage } from "../pages/settings/SettingsPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainLayout } from "../layouts/MainLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { LandingPage } from "../pages/LandingPage";
import { ErrorPage } from "../pages/ErrorPage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/jobs",
        element: <JobListPage />,
      },
      {
        path: "/jobs/:id",
        element: <JobDetailPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["candidate", "employee"]} />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/settings",
            element: <SettingsPage />,
          },
          // Candidate Routes
          {
            element: <ProtectedRoute allowedRoles={["candidate"]} />,
            children: [
              {
                path: "/candidate/applications",
                element: <ApplicationsPage />,
              },
            ],
          },
          // Employee Routes
          {
            element: <ProtectedRoute allowedRoles={["employee"]} />,
            children: [
              {
                path: "/manage/dashboard",
                element: <EmployeeDashboard />,
              },
              {
                path: "/manage/job-postings",
                element: <JobPostingsPage />,
              },
              {
                path: "/manage/job-postings/new",
                element: <CreateJobPage />,
              },
              {
                path: "/manage/candidates",
                element: <CandidatesPage />,
              },
              {
                path: "/manage/compare-candidates",
                element: <CompareCandidatesPage />,
              },
              {
                path: "/manage/interviews",
                element: <InterviewsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
