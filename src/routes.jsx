import { createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard/components/Dashboard';
import Repositories from './pages/Repositories/Repositories';
import Workspace from './pages/Workspace/Workspace';
import Repository from './pages/Repository/Repository';
import Profile from './pages/Profile/Profile/Profile';
import CreateRepo from './pages/CreateRepository/CreateRepo';
import Workspaces from './pages/Workspaces/Workspaces';
import ExploreContainer from './pages/Explore/ExploreContainer';
import CreateWorkspace from './pages/CreateWorkspace/CreateWorkspace';

// Layout components (if you have them)
// import AppLayout from './layouts/AppLayout';
// import AuthLayout from './layouts/AuthLayout';
// import LandingLayout from './layouts/LandingLayout';

/**
 * Application Routes
 * Using createBrowserRouter for better data loading and error handling
 * 
 * To add protected routes, wrap components with authentication check
 * Example: element: <ProtectedRoute><Dashboard /></ProtectedRoute>
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    // You can add errorElement, loader, etc. here
  },
  {
    path: '/repositories',
    element: <Repositories />,
  },
  {
    path: '/repository',
    element: <Repository />,
  },
  {
    path: '/repository/create',
    element: <CreateRepo />,
  },
  {
    path: '/workspace',
    element: <Workspace />,
  },
  {
    path: '/workspaces',
    element: <Workspaces />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/explore',
    element: <ExploreContainer />,
  },
  {
    path: '/createWorkspace',
    element: <CreateWorkspace />,
  },
  // Add more routes as needed
  // {
  //   path: '/login',
  //   element: <AuthLayout><Login /></AuthLayout>,
  // },
  // {
  //   path: '/signup',
  //   element: <AuthLayout><Signup /></AuthLayout>,
  // },
  // {
  //   path: '*',
  //   element: <NotFound />, // 404 page
  // },
]);

export default router;
