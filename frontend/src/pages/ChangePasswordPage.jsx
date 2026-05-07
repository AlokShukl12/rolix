import { useState } from "react";
import Layout from "../components/Layout";
import api from "../api/client";
import { validatePassword } from "../utils/validators";

const ChangePasswordPage = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    const passwordError = validatePassword(form.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.patch("/auth/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      setMessage(data.message || "Password updated.");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Change Password">
      <form className="card form-grid max-480" onSubmit={handleSubmit}>
        <label htmlFor="currentPassword">Current Password</label>
        <input
          id="currentPassword"
          type="password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
        />

        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </Layout>
  );
};

export default ChangePasswordPage;
