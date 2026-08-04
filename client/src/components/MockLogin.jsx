import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./MockLogin.css";

function MockLogin() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadCurrentUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
    }

    loadCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  function resetForm() {
    setDisplayName("");
    setEmail("");
    setPassword("");
    setError("");
    setMessage("");
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    setIsLoading(false);

    if (loginError) {
      setError(loginError.message);
      return;
    }

    resetForm();
    setShowLogin(false);
  }

  async function handleRegister(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (displayName.trim() === "") {
      setError("Please enter your display name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setIsLoading(true);

    const { data, error: registerError } =
      await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: displayName.trim(),
          },
          emailRedirectTo: window.location.origin,
        },
      });

    setIsLoading(false);

    if (registerError) {
      setError(registerError.message);
      return;
    }

    if (data.session) {
      resetForm();
      setShowLogin(false);
    } else {
      setMessage(
        "Account created. Please check your email and confirm your account."
      );
      setPassword("");
    }
  }

  async function handleLogout() {
    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      alert(logoutError.message);
    }
  }

  const displayUserName =
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "Student";

  return (
    <div className="mock-login">
      {user ? (
        <div className="logged-in-user">
          <span>Welcome, {displayUserName}</span>

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
          onClick={() => {
            resetForm();
            setShowLogin(true);
          }}
        >
          Login / Register
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
                resetForm();
              }}
              aria-label="Close login form"
            >
              ×
            </button>

            <h2>
              {authMode === "login"
                ? "Student Login"
                : "Create Account"}
            </h2>

            <form
              onSubmit={
                authMode === "login"
                  ? handleLogin
                  : handleRegister
              }
            >
              {authMode === "register" && (
                <>
                  <label htmlFor="register-name">
                    Display name
                  </label>

                  <input
                    id="register-name"
                    type="text"
                    value={displayName}
                    onChange={(event) =>
                      setDisplayName(event.target.value)
                    }
                    placeholder="Enter your name"
                    maxLength={80}
                    required
                  />
                </>
              )}

              <label htmlFor="login-email">Email</label>

              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="student@jcu.edu.au"
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
                placeholder="At least 6 characters"
                minLength={6}
                required
              />

              {error && (
                <p className="login-error">{error}</p>
              )}

              {message && (
                <p className="login-success">{message}</p>
              )}

              <button
                type="submit"
                className="submit-login"
                disabled={isLoading}
              >
                {isLoading
                  ? "Please wait..."
                  : authMode === "login"
                    ? "Login"
                    : "Register"}
              </button>
            </form>

            <button
              type="button"
              className="auth-mode-switch"
              onClick={() => {
                setAuthMode(
                  authMode === "login"
                    ? "register"
                    : "login"
                );
                setError("");
                setMessage("");
              }}
            >
              {authMode === "login"
                ? "No account? Register here"
                : "Already have an account? Login here"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MockLogin;