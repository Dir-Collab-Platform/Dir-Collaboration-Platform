import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { AuthProvider } from "./context/AuthContext/AuthContext";
import UserProvider from "./context/UserContext/UserProvider";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
