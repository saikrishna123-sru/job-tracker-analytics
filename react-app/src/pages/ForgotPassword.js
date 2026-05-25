import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetLink("");

    if (!email) {
      setError("Please enter your registered email.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/forgot-password", { email });
      if (typeof res.data === "string") {
        setMessage(res.data || "Reset instructions sent.");
      } else {
        setMessage(res.data?.message || "Reset instructions sent.");
        setResetLink(res.data?.resetLink || "");
      }
    } catch (err) {
      setError(
        (typeof err.response?.data === "string" && err.response.data) ||
          "Unable to process request."
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
              Forgot Password
            </h2>

            <p className="mt-1 text-center text-sm text-[#6e7781]">
              Enter your registered email to get a reset link.
            </p>

            <input
              placeholder="Email"
              className="mt-5 w-full rounded-xl border border-[#d8dde3] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#1d1d1f] outline-none transition placeholder:text-[#8a94a2] focus:border-[#94a3b8] focus:ring-4 focus:ring-[#dbeafe]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && <p className="mt-3 text-sm text-[#dc2626]">{error}</p>}
            {message && <p className="mt-3 text-sm text-[#065f46]">{message}</p>}
            {resetLink && (
              <a
                href={resetLink}
                className="mt-2 block text-sm font-medium text-[#1d4ed8] underline underline-offset-2"
              >
                Open reset link
              </a>
            )}

            <button
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-[#1d1d1f] py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Reset Link"}
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
