import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { AuthProvider } from "./context/AuthContext/AuthContext";
import { SocketProvider } from "./context/SocketContext/SocketContext";
import DashboardProvider from "./context/DashboardContext/DashboardProvider";
import NotificationProvider from "./context/NotificationContext/NotificationProvider";
import RepositoriesProvider from "./context/RepositoriesContext/RepositoriesProvider";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <DashboardProvider>
            <RepositoriesProvider>
              <RouterProvider router={router} />
            </RepositoriesProvider>
          </DashboardProvider>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
