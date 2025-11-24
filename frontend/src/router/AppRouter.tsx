import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { authEvents } from "../services/auth-events";
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

export const AppRouter: React.FC = () => {

  const navigate = useNavigate();

  // Every time onUnauthorized callback is called, now will navigate to login
  useEffect(() => {
    authEvents.onUnauthorized = () => {
      navigate("/login");
    };
  }, []);
  
  return (
    <Routes>
      {/* Public routes wrapped in PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/jobs" element={<JobListPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
      </Route>

      {/* Protected routes */}
      <Route
        element={<ProtectedRoute allowedRoles={["candidate", "employee"]} />}
      >
        <Route element={<MainLayout />}>
          {/* <Route path="/" element={<RoleBasedRedirect />} /> */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Candidate routes */}
          <Route element={<ProtectedRoute allowedRoles={["candidate"]} />}>
            <Route
              path="/candidate/applications"
              element={<ApplicationsPage />}
            />
          </Route>

          {/* Employe routes */}
          <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
            <Route path="/manage/dashboard" element={<EmployeeDashboard />} />
            <Route
              path="/manage/job-postings"
              element={<JobPostingsPage />}
            />
            <Route
              path="/manage/job-postings/new"
              element={<CreateJobPage />}
            />
            <Route
              path="/manage/candidates"
              element={<CandidatesPage />}
            />
            <Route
              path="/manage/compare-candidates"
              element={<CompareCandidatesPage />}
            />
            <Route
              path="/manage/interviews"
              element={<InterviewsPage />}
            />
          </Route>

          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
