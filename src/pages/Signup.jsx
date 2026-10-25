
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const API_URL = "http://localhost:5000/api/auth";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Signup failed.");
      }

      navigate("/login", {
        state: { message: "Account created! Please log in." },
      });
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Please try again."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-eyebrow">YOUR NEXT ADVENTURE STARTS HERE</p>
        <h1>Create your account</h1>
        <p className="auth-subtitle">
          Join WanderNest and start planning your next journey.
        </p>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="signup-name">Full name</label>
          <input
            id="signup-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            minLength={2}
            maxLength={80}
            autoComplete="name"
            required
          />

          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            maxLength={254}
            autoComplete="email"
            required
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            minLength={8}
            autoComplete="new-password"
            required
          />

          <label htmlFor="signup-confirm-password">Confirm password</label>
          <input
            id="signup-confirm-password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Enter password again"
            minLength={8}
            autoComplete="new-password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}

export default Signup;
