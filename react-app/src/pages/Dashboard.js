import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M4 7H20M4 12H20M4 17H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getTodayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toInputDate(value) {
  if (!value) return getTodayInputValue();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return getTodayInputValue();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value) {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleDateString();
}

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [applicationDate, setApplicationDate] = useState(getTodayInputValue());
  const [editJob, setEditJob] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await API.get("/jobs");
    setJobs(Array.isArray(res.data) ? res.data : []);
  };

  const addJob = async () => {
    if (!company || !role || !applicationDate) return;

    await API.post("/jobs", { company, role, status, applicationDate });
    setCompany("");
    setRole("");
    setStatus("Applied");
    setApplicationDate(getTodayInputValue());
    fetchJobs();
  };

  const deleteJob = async (id) => {
    await API.delete(`/jobs/${id}`);
    fetchJobs();
  };

  const openEdit = (job) => {
    setEditJob({
      ...job,
      applicationDate: toInputDate(job.applicationDate),
    });
  };

  const updateJob = async () => {
    await API.put(`/jobs/${editJob._id}`, {
      company: editJob.company,
      role: editJob.role,
      status: editJob.status,
      applicationDate: editJob.applicationDate,
    });

    setEditJob(null);
    fetchJobs();
  };

  const stats = {
    Total: jobs.length,
    Applied: jobs.filter((j) => j.status === "Applied").length,
    Interview: jobs.filter((j) => j.status === "Interview").length,
    Assessment: jobs.filter((j) => j.status === "Assessment").length,
    Offer: jobs.filter((j) => j.status === "Offer").length,
    Rejected: jobs.filter((j) => j.status === "Rejected").length,
  };

  const statAccent = {
    Total: "#0f172a",
    Applied: "#2563eb",
    Interview: "#3b82f6",
    Assessment: "#38bdf8",
    Offer: "#16a34a",
    Rejected: "#ef4444",
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(228,236,250,0.7)_44%,_rgba(245,245,247,1)_78%)]" />

      <div className="relative flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="w-full flex-1 overflow-y-auto px-3 pb-5 pt-3.5 sm:px-5 sm:pb-7 sm:pt-5 lg:px-8 lg:pt-7">
          <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between md:hidden">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#d8dde6] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#0f172a] shadow-[0_8px_20px_-18px_rgba(15,23,42,0.9)] transition active:scale-[0.98]"
              >
                <MenuIcon />
                Menu
              </button>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6e7781]">
                Dashboard
              </p>
            </div>

            <header>
              <h1 className="text-2xl font-semibold tracking-tight text-[#0f172a] sm:text-3xl lg:text-4xl">
                Dashboard
              </h1>
              <p className="mt-1.5 text-xs text-[#64748b] sm:text-sm md:text-base">
                Track applications with a compact, high-signal workflow.
              </p>
            </header>

            <section className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:gap-3 xl:grid-cols-4 2xl:grid-cols-6">
              {Object.entries(stats).map(([key, value]) => (
                <article
                  key={key}
                  className="group rounded-xl border border-[#e5eaf2] bg-white/90 px-3 py-2.5 shadow-[0_8px_20px_-18px_rgba(15,23,42,0.95)] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_30px_-24px_rgba(15,23,42,0.95)] active:scale-[0.995] sm:px-4 sm:py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#64748b]">
                      {key}
                    </p>
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: statAccent[key] || "#0f172a" }}
                    />
                  </div>
                  <h2 className="mt-1 text-2xl font-semibold leading-none tracking-tight text-[#0f172a] sm:text-[1.7rem]">
                    {value}
                  </h2>
                </article>
              ))}
            </section>

            <section className="rounded-2xl border border-[#e5eaf2] bg-white/88 p-3 shadow-[0_14px_32px_-26px_rgba(15,23,42,0.9)] backdrop-blur-xl sm:p-4">
              <h2 className="mb-3 text-base font-semibold text-[#0f172a] sm:text-lg">
                Add Job
              </h2>

              <div className="overflow-x-auto">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-[2fr_2fr_1.2fr_1.3fr_auto]">
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company"
                    className="w-full rounded-lg border border-[#d8dde3] bg-[#f8fafc] px-3.5 py-2 text-sm text-[#0f172a] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#dbeafe]"
                  />

                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Role"
                    className="w-full rounded-lg border border-[#d8dde3] bg-[#f8fafc] px-3.5 py-2 text-sm text-[#0f172a] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#dbeafe]"
                  />

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg border border-[#d8dde3] bg-[#f8fafc] px-3.5 py-2 text-sm text-[#0f172a] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#dbeafe]"
                  >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Assessment</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>

                  <input
                    type="date"
                    value={applicationDate}
                    onChange={(e) => setApplicationDate(e.target.value)}
                    className="w-full rounded-lg border border-[#d8dde3] bg-[#f8fafc] px-3.5 py-2 text-sm text-[#0f172a] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#dbeafe]"
                  />

                  <button
                    onClick={addJob}
                    className="w-full rounded-lg bg-[#111827] px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-[#0b1220] active:scale-[0.99] md:col-span-2 xl:col-span-1 xl:w-auto"
                  >
                    Add
                  </button>
                </div>
              </div>
            </section>

            <section className="space-y-2.5">
              {jobs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#d5dbe2] bg-white/65 p-4 text-center text-sm text-[#64748b]">
                  No jobs yet. Add your first application to get started.
                </div>
              ) : (
                <>
                  <div className="space-y-2.5 md:hidden">
                    {jobs.map((job) => (
                      <article
                        key={job._id}
                        className="rounded-xl border border-[#e5eaf2] bg-white/90 p-3 shadow-[0_10px_22px_-20px_rgba(15,23,42,0.85)] backdrop-blur-xl transition duration-200 active:scale-[0.997]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h2 className="break-words text-[15px] font-semibold text-[#0f172a]">
                              {job.company}
                            </h2>
                            <p className="break-words text-sm text-[#475569]">
                              {job.role}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-md border border-[#dce3ee] bg-[#f8fafc] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#334155]">
                            {job.status}
                          </span>
                        </div>

                        <p className="mt-1.5 text-xs font-medium text-[#64748b]">
                          Applied {formatDisplayDate(job.applicationDate)}
                        </p>

                        <div className="mt-2.5 flex items-center gap-1.5">
                          <button
                            onClick={() => openEdit(job)}
                            className="flex-1 rounded-md border border-[#d3dae6] bg-white px-3 py-1.5 text-sm font-medium text-[#0f172a] transition hover:bg-[#f3f4f6] active:scale-[0.99]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteJob(job._id)}
                            className="flex-1 rounded-md bg-[#ef4444] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#dc2626] active:scale-[0.99]"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="hidden overflow-x-auto rounded-xl border border-[#e5eaf2] bg-white/90 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.9)] backdrop-blur-xl md:block">
                    <table className="min-w-[760px] w-full">
                      <thead>
                        <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]/85 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
                          <th className="px-3.5 py-2.5">Company</th>
                          <th className="px-3.5 py-2.5">Role</th>
                          <th className="px-3.5 py-2.5">Status</th>
                          <th className="px-3.5 py-2.5">Applied</th>
                          <th className="px-3.5 py-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.map((job) => (
                          <tr
                            key={job._id}
                            className="border-b border-[#eef2f7] transition hover:bg-[#f8fafc]/70 last:border-b-0"
                          >
                            <td className="px-3.5 py-2.5 text-sm font-medium text-[#0f172a]">
                              {job.company}
                            </td>
                            <td className="px-3.5 py-2.5 text-sm text-[#475569]">
                              {job.role}
                            </td>
                            <td className="px-3.5 py-2.5 text-sm text-[#475569]">
                              {job.status}
                            </td>
                            <td className="px-3.5 py-2.5 text-sm text-[#475569]">
                              {formatDisplayDate(job.applicationDate)}
                            </td>
                            <td className="px-3.5 py-2.5">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => openEdit(job)}
                                  className="rounded-md border border-[#cfd5de] bg-white px-2.5 py-1.5 text-sm font-medium text-[#0f172a] transition hover:bg-[#f3f4f6]"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteJob(job._id)}
                                  className="rounded-md bg-[#ef4444] px-2.5 py-1.5 text-sm font-medium text-white transition hover:bg-[#dc2626]"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </section>
          </div>
        </main>
      </div>

      {editJob && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0f172a]/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#e5eaf2] bg-white/95 p-4 shadow-[0_25px_65px_-28px_rgba(15,23,42,0.7)] sm:p-5">
            <h2 className="text-lg font-semibold tracking-tight text-[#0f172a] sm:text-xl">
              Edit Job
            </h2>

            <div className="mt-3.5 space-y-2.5">
              <input
                value={editJob.company}
                onChange={(e) =>
                  setEditJob({ ...editJob, company: e.target.value })
                }
                className="w-full rounded-lg border border-[#d8dde3] bg-[#f8fafc] px-3.5 py-2 text-sm text-[#0f172a] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#dbeafe]"
                placeholder="Company"
              />

              <input
                value={editJob.role}
                onChange={(e) => setEditJob({ ...editJob, role: e.target.value })}
                className="w-full rounded-lg border border-[#d8dde3] bg-[#f8fafc] px-3.5 py-2 text-sm text-[#0f172a] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#dbeafe]"
                placeholder="Role"
              />

              <select
                value={editJob.status}
                onChange={(e) =>
                  setEditJob({ ...editJob, status: e.target.value })
                }
                className="w-full rounded-lg border border-[#d8dde3] bg-[#f8fafc] px-3.5 py-2 text-sm text-[#0f172a] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#dbeafe]"
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Assessment</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>

              <input
                type="date"
                value={editJob.applicationDate || getTodayInputValue()}
                onChange={(e) =>
                  setEditJob({ ...editJob, applicationDate: e.target.value })
                }
                className="w-full rounded-lg border border-[#d8dde3] bg-[#f8fafc] px-3.5 py-2 text-sm text-[#0f172a] outline-none transition focus:border-[#94a3b8] focus:ring-2 focus:ring-[#dbeafe]"
              />
            </div>

            <div className="mt-4 flex flex-col gap-2 md:flex-row md:justify-end">
              <button
                onClick={() => setEditJob(null)}
                className="w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#0f172a] transition hover:bg-[#f3f4f6] md:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={updateJob}
                className="w-full rounded-lg bg-[#111827] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0b1220] active:scale-[0.99] md:w-auto"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
