import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Invalid reset link.");
      return;
    }
    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/reset-password", { token, password });
      if (typeof res.data === "string") {
        setMessage(res.data || "Password updated successfully.");
      } else {
        setMessage(res.data?.message || "Password updated successfully.");
      }
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        (typeof err.response?.data === "string" && err.response.data) ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f5f7]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(222,232,255,0.68)_45%,_rgba(245,245,247,1)_78%)]" />

      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="w-[min(92vw,390px)]">
          <h1 className="mb-5 text-center text-5xl font-semibold tracking-tight text-[#0b1220]">
            Job Tracker
          </h1>

          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-white/80 bg-white/78 p-7 text-[#1d1d1f] shadow-[0_28px_70px_-34px_rgba(15,23,42,0.52)] backdrop-blur-2xl"
          >
            <h2 className="text-center text-3xl font-semibold tracking-tight text-[#1d1d1f]">
              Reset Password
            </h2>

            <p className="mt-1 text-center text-sm text-[#6e7781]">
              Set a new password for your account.
            </p>

            <div className="mt-5 space-y-3">
              <input
                placeholder="New password"
                type="password"
                className="w-full rounded-xl border border-[#d8dde3] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#1d1d1f] outline-none transition placeholder:text-[#8a94a2] focus:border-[#94a3b8] focus:ring-4 focus:ring-[#dbeafe]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                placeholder="Confirm new password"
                type="password"
                className="w-full rounded-xl border border-[#d8dde3] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#1d1d1f] outline-none transition placeholder:text-[#8a94a2] focus:border-[#94a3b8] focus:ring-4 focus:ring-[#dbeafe]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <p className="mt-3 text-sm text-[#dc2626]">{error}</p>}
            {message && <p className="mt-3 text-sm text-[#065f46]">{message}</p>}

            <button
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-[#1d1d1f] py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-4 w-full rounded-xl border border-[#d1d5db] bg-white py-2.5 text-sm font-medium text-[#1d1d1f] transition hover:bg-[#f3f4f6]"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
