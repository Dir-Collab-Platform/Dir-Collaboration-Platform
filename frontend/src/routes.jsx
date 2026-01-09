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
import NotFound from './pages/NotFound/NotFound';
import Landing from './pages/Landing/Landing';
import AuthCallback from './pages/AuthCallback/AuthCallback';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

/**
 * Application Routes
 * Using createBrowserRouter for better data loading and error handling
 * 
 * Routes with parameters:
 * - /workspace/:id - Individual workspace view
 * - /repository/:id - Individual repository view
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/repositories',
    element: (
      <ProtectedRoute>
        <Repositories />
      </ProtectedRoute>
    ),
  },
  {
    path: '/repository/:id',
    element: (
      <ProtectedRoute>
        <Workspace isRepositoryView={true} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/repository/create',
    element: (
      <ProtectedRoute>
        <CreateRepo />
      </ProtectedRoute>
    ),
  },
  {
    path: '/workspace/:id',
    element: (
      <ProtectedRoute>
        <Workspace />
      </ProtectedRoute>
    ),
  },
  {
    path: '/workspaces',
    element: (
      <ProtectedRoute>
        <Workspaces />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/explore',
    element: (
      <ProtectedRoute>
        <ExploreContainer />
      </ProtectedRoute>
    ),
  },
  {
    path: '/createWorkspace',
    element: (
      <ProtectedRoute>
        <CreateWorkspace />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;

