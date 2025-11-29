import type { ReactNode } from 'react';
import { 
  IconBriefcase, 
  IconUser, 
  IconSettings,
  IconFileText,
  IconChartBar,
  IconFileDescription,
  IconUsers,
  IconScale,
  IconCalendar,
} from '@tabler/icons-react';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { JobListPage } from '../pages/jobs/JobListPage';
import { JobDetailPage } from '../pages/jobs/JobDetailPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { ApplicationsPage } from '../pages/candidate/ApplicationsPage';
import { EmployeeDashboard } from '../pages/employee/EmployeeDashboard';
import { JobPostingsPage } from '../pages/employee/JobPostingsPage';
import { CreateJobPage } from '../pages/employee/CreateJobPage';
import { CandidatesPage } from '../pages/employee/CandidatesPage';
import { CompareCandidatesPage } from '../pages/employee/CompareCandidatesPage';
import { InterviewsPage } from '../pages/employee/InterviewsPage';

/**
 * Route configuration type
 */
export interface RouteConfig {
  path: string;
  element?: ReactNode;
  label?: string;
  icon?: ReactNode;
  showInNav?: boolean;
  requiresAuth?: boolean;
  allowedRoles?: readonly ('candidate' | 'employee')[];
  children?: RouteConfig[];
}

/**
 * Centralized route configuration
 * Single source of truth for all application routes
 */
export const ROUTES = {
  // Public routes (no auth required)
  PUBLIC: {
    HOME: {
      path: '/',
      element: <LandingPage />,
      label: 'Home',
      showInNav: false,
    },
    LOGIN: {
      path: '/login',
      element: <LoginPage />,
      showInNav: false,
    },
    JOBS: {
      path: '/jobs',
      element: <JobListPage />,
      label: 'Jobs',
      icon: <IconBriefcase size={20} />,
      showInNav: true,
    },
    JOB_DETAIL: {
      path: '/jobs/:id',
      element: <JobDetailPage />,
      showInNav: false,
    },
  },

  // Common authenticated routes (both candidate and employee)
  COMMON: {
    PROFILE: {
      path: '/profile',
      element: <ProfilePage />,
      label: 'Profile',
      icon: <IconUser size={20} />,
      showInNav: true,
      requiresAuth: true,
      allowedRoles: ['candidate', 'employee'],
    },
    SETTINGS: {
      path: '/settings',
      element: <SettingsPage />,
      label: 'Settings',
      icon: <IconSettings size={20} />,
      showInNav: true,
      requiresAuth: true,
      allowedRoles: ['candidate', 'employee'],
    },
  },

  // Candidate-only routes
  CANDIDATE: {
    APPLICATIONS: {
      path: '/candidate/applications',
      element: <ApplicationsPage />,
      label: 'My Applications',
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
      element: <EmployeeDashboard />,
      label: 'Dashboard',
      icon: <IconChartBar size={20} />,
      showInNav: true,
      requiresAuth: true,
      allowedRoles: ['employee'],
    },
    JOB_POSTINGS_GROUP: {
      path: '#job-postings',
      label: 'Job Postings',
      icon: <IconFileDescription size={20} />,
      showInNav: true,
      requiresAuth: true,
      allowedRoles: ['employee'],
      children: [
        {
          path: '/manage/job-postings',
          element: <JobPostingsPage />,
          label: 'Manage',
          showInNav: true,
          requiresAuth: true,
          allowedRoles: ['employee'],
        },
        {
          path: '/manage/job-postings/new',
          element: <CreateJobPage />,
          label: 'Create New',
          showInNav: true,
          requiresAuth: true,
          allowedRoles: ['employee'],
        },
        {
          path: '/manage/job-postings/edit/:id',
          element: <CreateJobPage />,
          label: 'Edit Job',
          showInNav: false,
          requiresAuth: true,
          allowedRoles: ['employee'],
        },
      ],
    },
    CANDIDATES: {
      path: '/manage/candidates',
      element: <CandidatesPage />,
      label: 'Candidates',
      icon: <IconUsers size={20} />,
      showInNav: true,
      requiresAuth: true,
      allowedRoles: ['employee'],
    },
    COMPARE_CANDIDATES: {
      path: '/manage/compare-candidates',
      element: <CompareCandidatesPage />,
      label: 'Compare Candidates',
      icon: <IconScale size={20} />,
      showInNav: true,
      requiresAuth: true,
      allowedRoles: ['employee'],
    },
    INTERVIEWS: {
      path: '/manage/interviews',
      element: <InterviewsPage />,
      label: 'Interviews',
      icon: <IconCalendar size={20} />,
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
