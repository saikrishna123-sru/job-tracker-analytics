import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/register", { email, password });
      alert("Registered successfully");
      navigate("/login");
    } catch {
      alert("Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f5f5f7]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(222,232,255,0.68)_45%,_rgba(245,245,247,1)_78%)]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-6 sm:py-10">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md rounded-[28px] border border-white/80 bg-white/78 p-5 text-[#1d1d1f] shadow-[0_28px_70px_-34px_rgba(15,23,42,0.52)] backdrop-blur-2xl sm:p-7"
        >
          <h1 className="text-center text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">
            Register
          </h1>

          <p className="mt-1 text-center text-sm text-[#6e7781]">
            Create your account and start tracking jobs.
          </p>

          <div className="mt-6 space-y-3">
            <input
              placeholder="Email"
              className="w-full rounded-xl border border-[#d8dde3] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#1d1d1f] outline-none transition placeholder:text-[#8a94a2] focus:border-[#94a3b8] focus:ring-4 focus:ring-[#dbeafe]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Password"
              type="password"
              className="w-full rounded-xl border border-[#d8dde3] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#1d1d1f] outline-none transition placeholder:text-[#8a94a2] focus:border-[#94a3b8] focus:ring-4 focus:ring-[#dbeafe]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-[#1d1d1f] py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <p
            onClick={() => navigate("/login")}
            className="mt-4 cursor-pointer text-center text-sm text-[#6e7781] transition hover:text-[#1d1d1f]"
          >
            Back to login
          </p>
        </form>
      </div>
    </div>
  );
}
