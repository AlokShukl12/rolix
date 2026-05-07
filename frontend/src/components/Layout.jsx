import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const rolePathMap = {
  ADMIN: "/admin",
  USER: "/user",
  OWNER: "/owner"
};

const Layout = ({ title, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>{title}</h1>
          {user && <p>{user.name}</p>}
        </div>
        <nav className="topbar-actions">
          {user && (
            <Link to={rolePathMap[user.role]} className="button ghost">
              Dashboard
            </Link>
          )}
          {user && (
            <Link to="/change-password" className="button ghost">
              Change Password
            </Link>
          )}
          <button onClick={onLogout} className="button danger" type="button">
            Logout
          </button>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
