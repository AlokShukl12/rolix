import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validateAddress, validateEmail, validateName, validatePassword } from "../utils/validators";
import extractApiError from "../utils/apiError";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const nameError = validateName(form.name);
    const addressError = validateAddress(form.address);
    const passwordError = validatePassword(form.password);
    if (nameError || !validateEmail(form.email) || addressError || passwordError) {
      setError(nameError || (!validateEmail(form.email) ? "Invalid email." : "") || addressError || passwordError);
      return;
    }

    try {
      setLoading(true);
      await signup(form);
      navigate("/user");
    } catch (err) {
      setError(extractApiError(err, "Signup failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>User Signup</h2>
        <p className="hint">
          Name must be 20-60 characters. Password must be 8-16 chars with 1 uppercase and 1 special character.
        </p>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />

        <label htmlFor="address">Address</label>
        <textarea id="address" name="address" value={form.address} onChange={handleChange} rows={4} />

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
          {loading ? "Creating account..." : "Sign Up"}
        </button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
