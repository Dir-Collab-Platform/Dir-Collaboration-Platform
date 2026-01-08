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
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/repositories',
    element: <Repositories />,
  },
  {
    path: '/repository/:id',
    element: <Workspace isRepositoryView={true} />,
  },
  {
    path: '/repository/create',
    element: <CreateRepo />,
  },
  {
    path: '/workspace/:id',
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
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
