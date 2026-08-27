import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DEMO_ACCOUNTS = [
  { label: "Admin Owner", email: "owner@educonnect.com" },
  { label: "Ali Ahmed", email: "ali@educonnect.com" },
  { label: "Mr. Ahmed", email: "teacher@educonnect.com" },
];
const DEMO_PASSWORD = "Demo@123";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="login-hero-brand">
          <div className="logo-icon">C</div>
          <span>Chat Box</span>
        </div>

        <div className="login-hero-copy">
          <h1>Real conversations, in real time.</h1>
          <p>
            One place for your team to message, see who's online, and stay in sync —
            built for teams who need messages to actually arrive.
          </p>

          <ul className="login-hero-features">
            <li>
              <span className="check">✓</span> Live delivery, read receipts &amp; typing indicators
            </li>
            <li>
              <span className="check">✓</span> Full message history, persisted and searchable
            </li>
            <li>
              <span className="check">✓</span> Presence-aware — know who's online right now
            </li>
          </ul>
        </div>

        <div className="login-hero-footer">© 2026 Chat Box</div>
      </div>

      <div className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to your conversations</p>

          {error && <div className="login-error">{error}</div>}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@educonnect.com"
              required
              autoComplete="username"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </label>

          <button type="submit" className="login-submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <div className="login-demo">
            <p>Demo accounts (password: {DEMO_PASSWORD})</p>
            <div className="login-demo-list">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  type="button"
                  key={account.email}
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(DEMO_PASSWORD);
                  }}
                >
                  {account.label}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
