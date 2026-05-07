import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import UserDashboardPage from "./pages/user/UserDashboardPage";
import OwnerDashboardPage from "./pages/owner/OwnerDashboardPage";

const homeByRole = {
  ADMIN: "/admin",
  USER: "/user",
  OWNER: "/owner"
};

const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="center-page">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={homeByRole[user.role]} replace />;
};

const App = () => (
  <Routes>
    <Route path="/" element={<HomeRedirect />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route
      path="/change-password"
      element={
        <ProtectedRoute>
          <ChangePasswordPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin"
      element={
        <ProtectedRoute roles={["ADMIN"]}>
          <AdminDashboardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/user"
      element={
        <ProtectedRoute roles={["USER"]}>
          <UserDashboardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/owner"
      element={
        <ProtectedRoute roles={["OWNER"]}>
          <OwnerDashboardPage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
