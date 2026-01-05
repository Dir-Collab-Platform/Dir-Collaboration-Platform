import "./App.css";
import { Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard/Dashboard/Dashboard";
import Repositories from "./pages/Repositories/Repositories";
import Workspace from "./pages/Workspace/Workspace";
import Repository from "./pages/Repository/Repository";
import Profile from "./pages/Profile/Profile/Profile";
import CreateRepo from "./pages/CreateRepository/CreateRepo";
import Workspaces from "./pages/Workspaces/Workspaces";
import ExploreContainer from "./pages/Explore/ExploreContainer";

function App() {
  return (
    <>
      {/* This is temporary routing to let everyone see the page they are building */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/repositories" element={<Repositories />} />
        <Route path="/repository" element={<Repository />} />
        <Route path="/repository/create" element={<CreateRepo />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/workspaces" element={<Workspaces />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/explore" element={<ExploreContainer />} />
      </Routes>
      
    </>
  );
}

export default App;
