import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
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

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(228,236,250,0.7)_44%,_rgba(245,245,247,1)_78%)]" />

      <div className="relative flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="w-full flex-1 overflow-y-auto px-4 pb-8 pt-5 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <div className="flex items-center justify-between md:hidden">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#d5dbe2] bg-white px-3 py-2 text-sm font-medium text-[#1d1d1f] shadow-[0_10px_24px_-18px_rgba(15,23,42,0.6)] transition hover:bg-[#f3f4f6]"
              >
                <MenuIcon />
                Menu
              </button>
              <p className="text-xs font-medium uppercase tracking-wide text-[#6e7781]">
                Dashboard
              </p>
            </div>

            <header>
              <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] md:text-4xl">
                Dashboard
              </h1>
              <p className="mt-2 text-sm text-[#6e7781] md:text-base">
                Track your applications with a clean overview.
              </p>
            </header>

            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {Object.entries(stats).map(([key, value]) => (
                <article
                  key={key}
                  className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.5)] backdrop-blur-2xl"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-[#6e7781]">
                    {key}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#1d1d1f] sm:text-2xl">
                    {value}
                  </h2>
                </article>
              ))}
            </section>

            <section className="rounded-[24px] border border-white/80 bg-white/78 p-4 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)] backdrop-blur-2xl sm:p-5">
              <h2 className="mb-4 text-lg font-semibold text-[#1d1d1f]">
                Add Job
              </h2>

              <div className="overflow-x-auto">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[2fr_2fr_1.2fr_1.3fr_auto]">
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company"
                    className="w-full rounded-xl border border-[#d8dde3] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#1d1d1f] outline-none transition focus:border-[#94a3b8] focus:ring-4 focus:ring-[#dbeafe]"
                  />

                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Role"
                    className="w-full rounded-xl border border-[#d8dde3] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#1d1d1f] outline-none transition focus:border-[#94a3b8] focus:ring-4 focus:ring-[#dbeafe]"
                  />

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-[#d8dde3] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#1d1d1f] outline-none transition focus:border-[#94a3b8] focus:ring-4 focus:ring-[#dbeafe]"
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
                    className="w-full rounded-xl border border-[#d8dde3] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#1d1d1f] outline-none transition focus:border-[#94a3b8] focus:ring-4 focus:ring-[#dbeafe]"
                  />

                  <button
                    onClick={addJob}
                    className="w-full rounded-xl bg-[#1d1d1f] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black md:col-span-2 xl:col-span-1 xl:w-auto"
                  >
                    Add
                  </button>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              {jobs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#ccd3dc] bg-white/60 p-6 text-center text-sm text-[#6e7781]">
                  No jobs yet. Add your first application to get started.
                </div>
              ) : (
                <>
                  <div className="space-y-3 md:hidden">
                    {jobs.map((job) => (
                      <article
                        key={job._id}
                        className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.5)] backdrop-blur-2xl"
                      >
                        <div className="space-y-1">
                          <h2 className="break-words text-base font-semibold text-[#1d1d1f]">
                            {job.company}
                          </h2>
                          <p className="break-words text-sm text-[#475569]">
                            {job.role}
                          </p>
                          <p className="text-sm text-[#6e7781]">
                            {job.status} - {formatDisplayDate(job.applicationDate)}
                          </p>
                        </div>

                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                          <button
                            onClick={() => openEdit(job)}
                            className="w-full rounded-lg border border-[#cfd5de] bg-white px-3 py-2 text-sm font-medium text-[#1d1d1f] transition hover:bg-[#f3f4f6]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteJob(job._id)}
                            className="w-full rounded-lg bg-[#ef4444] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#dc2626]"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="hidden overflow-x-auto rounded-2xl border border-white/80 bg-white/80 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.5)] backdrop-blur-2xl md:block">
                    <table className="min-w-[760px] w-full">
                      <thead>
                        <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]/70 text-left text-xs font-semibold uppercase tracking-wide text-[#6e7781]">
                          <th className="px-4 py-3">Company</th>
                          <th className="px-4 py-3">Role</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Applied</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.map((job) => (
                          <tr key={job._id} className="border-b border-[#eef2f7] last:border-b-0">
                            <td className="px-4 py-3 text-sm font-medium text-[#1d1d1f]">
                              {job.company}
                            </td>
                            <td className="px-4 py-3 text-sm text-[#475569]">
                              {job.role}
                            </td>
                            <td className="px-4 py-3 text-sm text-[#475569]">
                              {job.status}
                            </td>
                            <td className="px-4 py-3 text-sm text-[#475569]">
                              {formatDisplayDate(job.applicationDate)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openEdit(job)}
                                  className="rounded-lg border border-[#cfd5de] bg-white px-3 py-1.5 text-sm font-medium text-[#1d1d1f] transition hover:bg-[#f3f4f6]"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteJob(job._id)}
                                  className="rounded-lg bg-[#ef4444] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#dc2626]"
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
          <div className="w-full max-w-md rounded-2xl border border-white/85 bg-white/85 p-4 shadow-[0_25px_65px_-28px_rgba(15,23,42,0.7)] sm:rounded-3xl sm:p-6">
            <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f] sm:text-2xl">
              Edit Job
            </h2>

            <div className="mt-4 space-y-3">
              <input
                value={editJob.company}
                onChange={(e) =>
                  setEditJob({ ...editJob, company: e.target.value })
                }
                className="w-full rounded-xl border border-[#d8dde3] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#1d1d1f] outline-none transition focus:border-[#94a3b8] focus:ring-4 focus:ring-[#dbeafe]"
                placeholder="Company"
              />

              <input
                value={editJob.role}
                onChange={(e) =>
                  setEditJob({ ...editJob, role: e.target.value })
                }
                className="w-full rounded-xl border border-[#d8dde3] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#1d1d1f] outline-none transition focus:border-[#94a3b8] focus:ring-4 focus:ring-[#dbeafe]"
                placeholder="Role"
              />

              <select
                value={editJob.status}
                onChange={(e) =>
                  setEditJob({ ...editJob, status: e.target.value })
                }
                className="w-full rounded-xl border border-[#d8dde3] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#1d1d1f] outline-none transition focus:border-[#94a3b8] focus:ring-4 focus:ring-[#dbeafe]"
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
                className="w-full rounded-xl border border-[#d8dde3] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#1d1d1f] outline-none transition focus:border-[#94a3b8] focus:ring-4 focus:ring-[#dbeafe]"
              />
            </div>

            <div className="mt-5 flex flex-col md:flex-row gap-2 md:justify-end">
              <button
                onClick={() => setEditJob(null)}
                className="w-full rounded-xl border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#1d1d1f] transition hover:bg-[#f3f4f6] sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={updateJob}
                className="w-full rounded-xl bg-[#1d1d1f] px-4 py-2 text-sm font-medium text-white transition hover:bg-black sm:w-auto"
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


