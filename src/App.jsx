import './App.css'
import { Routes, Route } from 'react-router'
import Dashboard from './pages/Dashboard/Dashboard/Dashboard'
import Repositories from './pages/Repositories/Repositories/Repositories'
import Workspace from './pages/Workspace/Workspace/Workspace'
import Repository from './pages/Repository/Repository/Repository'
import Workspaces from './pages/Workspaces/Workspaces/Workspaces'
import Header from "./common-components/Header/Header";
import Footer from "./common-components/Footer/Footer";

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path='/' element={<Dashboard />}/> 
          <Route path='/repositories' element={<Repositories />} />
          <Route path='/repository' element={<Repository />} />
          <Route path='/workspace' element={<Workspace />} />
          <Route path='/workspaces' element={<Workspaces />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App;
