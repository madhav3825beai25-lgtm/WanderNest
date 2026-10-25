
import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "../styles/Auth.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const successMessage = location.state?.message;

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "The login server returned an unexpected response."
        );
      }

      const data = await response.json();

      if (!response.ok || !data.success || !data.token) {
        throw new Error(
          data.message || "Login failed. Please try again."
        );
      }

      // Save authentication token
      sessionStorage.setItem(
        "wandernest_token",
        data.token
      );

      // Save user information
      const userName =
        data.user?.name || data.name || "Traveler";

      const userEmail =
        data.user?.email || email.trim().toLowerCase();

      sessionStorage.setItem(
        "wandernest_user_name",
        userName
      );

      sessionStorage.setItem(
        "wandernest_user_email",
        userEmail
      );

      // Update navbar immediately
      window.dispatchEvent(new Event("authChange"));

      // Return to the requested page
      const from = location.state?.from;

      const destination =
        typeof from === "string" &&
        from.startsWith("/") &&
        !from.startsWith("//")
          ? from
          : "/";

      navigate(destination, {
        replace: true,
      });
    } catch (err) {
      console.error("Login error:", err);

      const isNetworkError =
        err instanceof TypeError ||
        err.message === "Failed to fetch" ||
        err.message.includes("NetworkError");

      if (isNetworkError) {
        setError(
          "Cannot connect to the backend server. Make sure it is running on port 5000."
        );
      } else {
        setError(
          err.message ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-eyebrow">
          WELCOME BACK
        </p>

        <h1>Log in to WanderNest</h1>

        <p className="auth-subtitle">
          Sign in to continue planning your next adventure.
        </p>

        {successMessage && (
          <div
            className="auth-success"
            role="status"
          >
            {successMessage}
          </div>
        )}

        {error && (
          <div
            className="auth-error"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">
            Email address
          </label>

          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="login-password">
            Password
          </label>

          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          New to WanderNest?{" "}
          <Link to="/signup">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
