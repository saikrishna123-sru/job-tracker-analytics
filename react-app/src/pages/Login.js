import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M1.5 12S5.5 5.5 12 5.5S22.5 12 22.5 12S18.5 18.5 12 18.5S1.5 12 1.5 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.6 5.7C11.05 5.58 11.52 5.5 12 5.5C18.5 5.5 22.5 12 22.5 12C21.93 12.93 21.26 13.79 20.49 14.56"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.2 7.2C3.58 9.05 1.5 12 1.5 12C1.5 12 5.5 18.5 12 18.5C13.96 18.5 15.7 17.91 17.2 16.98"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.1 10.1C9.58 10.63 9.25 11.36 9.25 12.17C9.25 13.79 10.56 15.1 12.18 15.1C12.99 15.1 13.72 14.77 14.25 14.24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });
      login(res.data.token, res.data.email, rememberMe);
    } catch (err) {
      const serverMessage =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message;
      setError(serverMessage || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f5f7]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(222,232,255,0.68)_45%,_rgba(245,245,247,1)_78%)]" />

      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="w-[min(92vw,390px)]">
          <h1
            className="mb-5 text-center text-5xl font-semibold tracking-tight text-[#0b1220]"
            style={{
              fontFamily:
                "'Avenir Next', 'SF Pro Display', 'Helvetica Neue', -apple-system, sans-serif",
            }}
          >
            Job Tracker
          </h1>

          <form
            onSubmit={handleLogin}
            className="rounded-[28px] border border-white/80 bg-white/78 p-7 text-[#1d1d1f] shadow-[0_28px_70px_-34px_rgba(15,23,42,0.52)] backdrop-blur-2xl"
          >
            <h2 className="text-center text-4xl font-semibold tracking-tight text-[#1d1d1f]">
              Login
            </h2>

            <p className="mt-1 text-center text-sm text-[#6e7781]">
              Continue tracking your career progress.
            </p>

            <div className="mt-6 space-y-3">
              <input
                placeholder="Email"
                className="w-full rounded-xl border border-[#d8dde3] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#1d1d1f] outline-none transition placeholder:text-[#8a94a2] focus:border-[#94a3b8] focus:ring-4 focus:ring-[#dbeafe]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="relative">
                <input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-xl border border-[#d8dde3] bg-[#f8fafc] px-4 py-2.5 pr-12 text-sm text-[#1d1d1f] outline-none transition placeholder:text-[#8a94a2] focus:border-[#94a3b8] focus:ring-4 focus:ring-[#dbeafe]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-[#6e7781] transition hover:text-[#1d1d1f]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[#6e7781]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 accent-[#1d1d1f]"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-[#6e7781] underline underline-offset-2 transition hover:text-[#1d1d1f]"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <p className="mt-3 text-sm font-medium text-[#dc2626]" role="alert">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-[#1d1d1f] py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <p
              onClick={() => navigate("/register")}
              className="mt-4 cursor-pointer text-center text-sm text-[#6e7781] transition hover:text-[#1d1d1f]"
            >
              Create account
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
