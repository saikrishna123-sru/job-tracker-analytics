import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const GOAL_TARGET = 20;

function getObjectIdDate(id) {
  try {
    return new Date(parseInt(id.substring(0, 8), 16) * 1000);
  } catch {
    return null;
  }
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);

  const email =
    localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
  const initial = email ? email[0].toUpperCase() : "?";

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Analytics", path: "/analytics" },
  ];

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await API.get("/jobs");
        setJobs(Array.isArray(res.data) ? res.data : []);
      } catch {
        setJobs([]);
      }
    };

    loadJobs();
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (!isOpen || window.innerWidth >= 768) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  const followUps = useMemo(() => {
    return {
      applied: jobs.filter((job) => job.status === "Applied").length,
      interview: jobs.filter((job) => job.status === "Interview").length,
      assessment: jobs.filter((job) => job.status === "Assessment").length,
    };
  }, [jobs]);

  const progress = useMemo(() => {
    const value = jobs.length;
    const percent = Math.min(100, Math.round((value / GOAL_TARGET) * 100));
    return { value, percent };
  }, [jobs.length]);

  const recentJobs = useMemo(() => {
    return [...jobs]
      .sort((a, b) => {
        const da = getObjectIdDate(a._id || "");
        const db = getObjectIdDate(b._id || "");
        return (db?.getTime() || 0) - (da?.getTime() || 0);
      })
      .slice(0, 3);
  }, [jobs]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-[#0f172a]/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[min(84vw,300px)] shrink-0 border-r border-white/70 bg-white/80 text-[#1d1d1f] backdrop-blur-2xl transition-transform duration-300 md:sticky md:top-0 md:z-0 md:h-screen md:w-[252px] ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-4 py-5 md:px-5 md:py-6">
          <div className="mb-6 flex items-center justify-between md:mb-8">
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              Job Tracker
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#d5dbe2] bg-white p-2 text-[#1d1d1f] transition hover:bg-[#f3f4f6] md:hidden"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-[#1d1d1f] text-white shadow-[0_10px_30px_-16px_rgba(15,23,42,0.95)]"
                      : "bg-transparent text-[#1d1d1f]/80 hover:bg-white hover:text-[#1d1d1f]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
            <section className="rounded-2xl border border-white/85 bg-white/85 p-3 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.55)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6e7781]">
                Pipeline Snapshot
              </p>
              <div className="mt-2 space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#6e7781]">Applied</span>
                  <span className="font-semibold">{followUps.applied}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6e7781]">Interview</span>
                  <span className="font-semibold">{followUps.interview}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6e7781]">Assessment</span>
                  <span className="font-semibold">{followUps.assessment}</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/85 bg-white/85 p-3 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.55)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6e7781]">
                Quick Actions
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavigate("/")}
                  className="rounded-lg border border-[#d5dbe2] bg-white px-2 py-1.5 text-xs font-medium transition hover:bg-[#f3f4f6]"
                >
                  Add Job
                </button>
                <button
                  onClick={() => handleNavigate("/analytics")}
                  className="rounded-lg border border-[#d5dbe2] bg-white px-2 py-1.5 text-xs font-medium transition hover:bg-[#f3f4f6]"
                >
                  View Charts
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-white/85 bg-white/85 p-3 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.55)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6e7781]">
                This Month Goal
              </p>
              <p className="mt-1 text-sm font-medium text-[#1d1d1f]">
                {progress.value} / {GOAL_TARGET} applications
              </p>
              <div className="mt-2 h-2 rounded-full bg-[#e2e8f0]">
                <div
                  className="h-2 rounded-full bg-[#1d4ed8]"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-white/85 bg-white/85 p-3 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.55)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6e7781]">
                Recent Activity
              </p>
              <div className="mt-2 space-y-1.5">
                {recentJobs.length === 0 ? (
                  <p className="text-xs text-[#6e7781]">No activity yet.</p>
                ) : (
                  recentJobs.map((job) => (
                    <div key={job._id} className="text-xs">
                      <p className="truncate font-medium text-[#1d1d1f]">
                        {job.company}
                      </p>
                      <p className="text-[#6e7781]">{job.status}</p>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-white/85 bg-white/85 p-3 shadow-[0_12px_28px_-22px_rgba(15,23,42,0.55)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6e7781]">
                Status Legend
              </p>
              <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#2563eb]" />
                  <span>Applied</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#3b82f6]" />
                  <span>Interview</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#60a5fa]" />
                  <span>Assessment</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                  <span>Offer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                  <span>Rejected</span>
                </div>
              </div>
            </section>
          </div>

          <div className="pt-4">
            <div className="mb-4 rounded-2xl border border-white/90 bg-white/80 p-3 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.55)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1d1d1f] to-[#4b5563] text-sm font-semibold text-white">
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#6e7781]">Signed in as</p>
                  <p className="truncate text-sm font-medium text-[#1d1d1f]">
                    {email || "No Email"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full rounded-xl bg-[#1d1d1f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
