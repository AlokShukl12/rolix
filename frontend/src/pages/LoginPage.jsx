import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validateEmail } from "../utils/validators";

const dashboardPath = {
  ADMIN: "/admin",
  USER: "/user",
  OWNER: "/owner"
};

const ADMIN_DEMO_CREDENTIALS = {
  email: "admin@relix.local",
  password: "Admin@123"
};

const OWNER_DEMO_CREDENTIALS = {
  email: "owner@relix.local",
  password: "Owner@123"
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const performLogin = async (payload) => {
    try {
      setLoading(true);
      const data = await login(payload);
      navigate(dashboardPath[data.user.role]);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateEmail(form.email)) {
      setError("Enter a valid email.");
      return;
    }
    if (!form.password) {
      setError("Password is required.");
      return;
    }

    await performLogin(form);
  };

  const handleAdminLogin = async () => {
    setError("");
    setForm(ADMIN_DEMO_CREDENTIALS);
    await performLogin(ADMIN_DEMO_CREDENTIALS);
  };

  const handleOwnerLogin = async () => {
    setError("");
    setForm(OWNER_DEMO_CREDENTIALS);
    await performLogin(OWNER_DEMO_CREDENTIALS);
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        {error && <p className="error">{error}</p>}

        <button className="button" disabled={loading} type="submit">
          {loading ? "Logging in..." : "Login"}
        </button>
        <button className="button admin-login" disabled={loading} type="button" onClick={handleAdminLogin}>
          {loading ? "Logging in..." : "Login as Admin"}
        </button>
        <button className="button owner-login" disabled={loading} type="button" onClick={handleOwnerLogin}>
          {loading ? "Logging in..." : "Login as Owner"}
        </button>
        <p>
          New user? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
