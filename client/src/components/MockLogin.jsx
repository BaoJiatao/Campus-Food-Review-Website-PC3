import { useState } from "react";
import "./MockLogin.css";

const DEMO_EMAIL = "student@jcu.edu.au";
const DEMO_PASSWORD = "123456";

function MockLogin() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("campusFoodUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(event) {
    event.preventDefault();
    setError("");

    if (
      email.trim().toLowerCase() === DEMO_EMAIL &&
      password === DEMO_PASSWORD
    ) {
      const loggedInUser = {
        name: "Student",
        email: DEMO_EMAIL,
      };

      localStorage.setItem(
        "campusFoodUser",
        JSON.stringify(loggedInUser)
      );

      setUser(loggedInUser);
      setShowLogin(false);
      setEmail("");
      setPassword("");
    } else {
      setError("Incorrect email or password.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("campusFoodUser");
    setUser(null);
  }

  return (
    <div className="mock-login">
      {user ? (
        <div className="logged-in-user">
          <span>Welcome, {user.name}</span>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="login-button"
          onClick={() => setShowLogin(true)}
        >
          Login
        </button>
      )}

      {showLogin && (
        <div className="login-overlay">
          <div className="login-modal">
            <button
              type="button"
              className="close-login"
              onClick={() => {
                setShowLogin(false);
                setError("");
              }}
              aria-label="Close login form"
            >
              ×
            </button>

            <h2>Student Login</h2>

            <form onSubmit={handleLogin}>
              <label htmlFor="login-email">Email</label>

              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="student@jcu.edu.au"
                required
              />

              <label htmlFor="login-password">Password</label>

              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                required
              />

              {error && <p className="login-error">{error}</p>}

              <button type="submit" className="submit-login">
                Login
              </button>
            </form>

            <p className="demo-account">
              Demo account: student@jcu.edu.au / 123456
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MockLogin;