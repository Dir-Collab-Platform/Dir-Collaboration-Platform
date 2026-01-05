import './App.css'
import { Routes, Route } from 'react-router'
import Dashboard from './pages/Dashboard/Dashboard/Dashboard'
import Repositories from './pages/Repositories/Repositories'
import Workspace from './pages/Workspace/Workspace'
import Repository from './pages/Repository/Repository'
import Workspaces from './pages/Workspaces/Workspaces/Workspaces'
import ExploreContainer from './pages/Explore/ExploreContainer'
import CreateWorkspace from './pages/CreateWorkspace/CreateWorkspace/CreateWorkspace' 

function App() {
  return (
    <>
      {/* This is temporary routing to let everyone see the page they are building */}
      <Routes>
        <Route path='/' element={<Dashboard />}/> 
        <Route path='/repositories' element={<Repositories />} />
        <Route path='/repository' element={<Repository />} />
        <Route path='/workspace' element={<Workspace />} />
        <Route path='/workspaces' element={<Workspaces />} />
        <Route path='/explore' element={<ExploreContainer />} />
        <Route path='/createWorkspace' element={<CreateWorkspace />} />

      </Routes>
      
    </>
  )
}

export default App
