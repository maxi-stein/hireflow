import type { ReactNode } from 'react';
import {
  IconBriefcase,
  IconUser,
  IconFileText,
  IconChartBar,
  IconFileDescription,
  IconUsers,
  IconCalendar,
  IconUserPlus,
} from '@tabler/icons-react';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { OAuthCallbackPage } from '../pages/OAuthCallbackPage';
import { JobListPage } from '../pages/jobs/JobListPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { ApplicationsPage } from '../pages/candidate/ApplicationsPage';
import { DashboardPage } from '../pages/employee/DashboardPage';
import { JobPostingsPage } from '../pages/employee/JobPostingsPage';
import { CreateJobPage } from '../pages/employee/CreateJobPage';
import { CandidateApplicationsPage } from '../pages/employee/CandidateApplicationsPage';
import { CompareCandidatesPage } from '../pages/employee/CompareCandidatesPage';
import { CalendarPage } from '../pages/employee/CalendarPage';
import { CandidatePage } from '../pages/employee/CandidatePage';
import { CandidatesListPage } from '../pages/employee/CandidatesListPage';

import { ReviewsPage } from '../pages/employee/ReviewsPage';
import { HiredCandidatesPage } from '../pages/employee/HiredCandidatesPage';
import { CreateEmployeePage } from '../pages/employee/CreateEmployeePage';

// Route configuration type
export interface RouteConfig {
  path: string;
  element?: ReactNode;
  label?: string;
  icon?: ReactNode;
  showInNav?: boolean;
  requiresAuth?: boolean;
  allowedRoles?: readonly ('candidate' | 'employee')[];
  children?: RouteConfig[];
  section?: 'job-postings' | 'candidates' | 'interviews';
}

//Centralized route configuration
export const ROUTES = {
  // Public routes (no auth required)
  PUBLIC: {
    HOME: {
      path: '/',
      element: <LandingPage />,
      showInNav: false,
    },
    LOGIN: {
      path: '/login',
      element: <LoginPage />,
      showInNav: false,
    },
    REGISTER: {
      path: '/register',
      element: <RegisterPage />,
      showInNav: false,
    },
    OAUTH_CALLBACK: {
      path: '/oauth-callback',
      element: <OAuthCallbackPage />,
      showInNav: false,
    },
    JOBS: {
      path: '/jobs',
      element: <JobListPage />,
      label: 'navigation:jobs',
      icon: <IconBriefcase size={20} />,
      showInNav: true,
    },
  },

  // Common authenticated routes (both candidate and employee)
  COMMON: {
    PROFILE: {
      path: '/profile',
      element: <ProfilePage />,
      label: 'navigation:profile',
      icon: <IconUser size={20} />,
      showInNav: true,
      requiresAuth: true,
      allowedRoles: ['candidate', 'employee'],
    }
  },

  // Candidate-only routes
  CANDIDATE: {
    APPLICATIONS: {
      path: '/candidate/applications',
      element: <ApplicationsPage />,
      label: 'navigation:myApplications',
      icon: <IconFileText size={20} />,
      showInNav: true,
      requiresAuth: true,
      allowedRoles: ['candidate'],
    },
  },

  // Employee-only routes
  EMPLOYEE: {
    DASHBOARD: {
      path: '/manage/dashboard',
      element: <DashboardPage />,
      label: 'navigation:dashboard',
      icon: <IconChartBar size={20} />,
      showInNav: true,
      requiresAuth: true,
      allowedRoles: ['employee'],
    },
    JOB_POSTINGS_GROUP: {
      path: '#job-postings',
      label: 'navigation:jobPostings',
      icon: <IconFileDescription size={20} />,
      showInNav: true,
      requiresAuth: true,
      allowedRoles: ['employee'],
      section: 'job-postings',
      children: [
        {
          path: '/manage/job-postings',
          element: <JobPostingsPage />,
          label: 'navigation:manage',
          showInNav: true,
          requiresAuth: true,
          allowedRoles: ['employee'],
          section: 'job-postings',
        },
        {
          path: '/manage/job-postings/new',
          element: <CreateJobPage />,
          label: 'navigation:createNew',
          showInNav: true,
          requiresAuth: true,
          allowedRoles: ['employee'],
          section: 'job-postings',
        },
        {
          path: '/manage/job-postings/edit/:id',
          element: <CreateJobPage />,
          label: 'navigation:editJob',
          showInNav: false,
          requiresAuth: true,
          allowedRoles: ['employee'],
          section: 'job-postings',
        },
      ],
    },
    CANDIDATES_GROUP: {
      path: '#candidates',
      label: 'navigation:candidates',
      icon: <IconUsers size={20} />,
      showInNav: true,
      requiresAuth: true,
      allowedRoles: ['employee'],
      section: 'candidates',
      children: [
        {
          path: '/manage/candidates/list',
          element: <CandidatesListPage />,
          label: 'navigation:allCandidates',
          showInNav: true,
          requiresAuth: true,
          allowedRoles: ['employee'],
          section: 'candidates',
        },
        {
          path: '/manage/candidates/applications',
          element: <CandidateApplicationsPage />,
          label: 'navigation:candidateApplications',
          showInNav: true,
          requiresAuth: true,
          allowedRoles: ['employee'],
          section: 'candidates',
        },
        {
          path: '/manage/candidates/compare',
          element: <CompareCandidatesPage />,
          label: 'navigation:compareCandidates',
          showInNav: true,
          requiresAuth: true,
          allowedRoles: ['employee'],
          section: 'candidates',
        },
        {
          path: '/manage/candidates/hired',
          element: <HiredCandidatesPage />,
          label: 'navigation:hiredCandidates',
          showInNav: true,
          requiresAuth: true,
          allowedRoles: ['employee'],
          section: 'candidates',
        },
        {
          path: '/manage/candidates/list/:id',
          element: <CandidatePage />,
          label: 'navigation:candidateDetails',
          showInNav: false,
          requiresAuth: true,
          allowedRoles: ['employee'],
          section: 'candidates',
        },
      ],
    },

    INTERVIEWS_GROUP: {
      path: '#interviews',
      label: 'navigation:interviews',
      icon: <IconCalendar size={20} />,
      showInNav: true,
      requiresAuth: true,
      allowedRoles: ['employee'],
      section: 'interviews',
      children: [
        {
          path: '/manage/interviews',
          element: <CalendarPage />,
          label: 'navigation:calendar',
          showInNav: true,
          requiresAuth: true,
          allowedRoles: ['employee'],
          section: 'interviews',
        },
        {
          path: '/manage/reviews',
          element: <ReviewsPage />,
          label: 'navigation:reviews',
          showInNav: true,
          requiresAuth: true,
          allowedRoles: ['employee'],
          section: 'interviews',
        },
      ],
    },

    REGISTER_EMPLOYEE: {
      path: '/manage/users/create',
      element: <CreateEmployeePage />,
      label: 'navigation:registerEmployees',
      icon: <IconUserPlus size={20} />,
      showInNav: true,
      requiresAuth: true,
      allowedRoles: ['employee'],
    },
  },
} as const;


// Helper to flatten routes for the router
const flattenRoutes = (routes: RouteConfig[]): RouteConfig[] => {
  return routes.reduce((acc, route) => {
    if (route.children) {
      acc.push(...flattenRoutes(route.children));
    }
    if (route.element) {
      acc.push(route);
    }
    return acc;
  }, [] as RouteConfig[]);
};

// Get all routes as a flat array for Router
export const getAllRoutes = (): RouteConfig[] => {
  const allGroups = [
    ...Object.values(ROUTES.EMPLOYEE),
    ...Object.values(ROUTES.PUBLIC),
    ...Object.values(ROUTES.CANDIDATE),
    ...Object.values(ROUTES.COMMON),
  ] as RouteConfig[];
  return flattenRoutes(allGroups);
};

// Get nav items for a specific user type (hierarchical)
export const getNavItemsForUser = (userType: 'candidate' | 'employee' | null): RouteConfig[] => {
  const allGroups = [
    ...Object.values(ROUTES.EMPLOYEE),
    ...Object.values(ROUTES.PUBLIC),
    ...Object.values(ROUTES.CANDIDATE),
    ...Object.values(ROUTES.COMMON),
  ] as RouteConfig[];

  return allGroups.filter(route => {
    // Must have showInNav = true
    if (!route.showInNav) return false;

    // Public routes are always shown
    if (!route.requiresAuth) return true;

    // Auth required - check user type
    if (!userType) return false;

    return route.allowedRoles?.includes(userType);
  });
};

// Get protected routes by role
export const getProtectedRoutes = (role: 'candidate' | 'employee'): RouteConfig[] => {
  return getAllRoutes().filter(
    route => route.requiresAuth && route.allowedRoles?.includes(role)
  );
};
