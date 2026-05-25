import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

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

export default function Analytics() {
  const [jobs, setJobs] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await API.get("/jobs");
    setJobs(Array.isArray(res.data) ? res.data : []);
  };

  const stats = {
    Applied: 0,
    Interview: 0,
    Assessment: 0,
    Offer: 0,
    Rejected: 0,
  };

  jobs.forEach((job) => {
    if (stats[job.status] !== undefined) {
      stats[job.status] += 1;
    }
  });

  const labels = Object.keys(stats);
  const values = Object.values(stats);
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(231,240,255,0.7)_46%,_rgba(245,245,247,1)_78%)]" />

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
                Analytics
              </p>
            </div>

            <header>
              <h1 className="text-2xl font-semibold tracking-tight text-[#0f172a] sm:text-3xl lg:text-4xl">
                Analytics
              </h1>
              <p className="mt-1.5 text-xs text-[#64748b] sm:text-sm md:text-base">
                Compact insight view for application stage performance.
              </p>
            </header>

            <section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:gap-4">
              <article className="rounded-2xl border border-[#e5eaf2] bg-white/90 p-3 shadow-[0_14px_30px_-25px_rgba(15,23,42,0.9)] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 sm:p-4">
                <h2 className="text-sm font-semibold text-[#0f172a] sm:text-base">
                  Status Distribution
                </h2>

                <div className="mt-2.5 h-[210px] sm:mt-3 sm:h-[250px] lg:h-[285px]">
                  <Pie
                    data={{
                      labels,
                      datasets: [
                        {
                          data: values,
                          backgroundColor: [
                            "#2563eb",
                            "#3b82f6",
                            "#60a5fa",
                            "#38bdf8",
                            "#64748b",
                          ],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      ...baseOptions,
                      cutout: "66%",
                      animation: {
                        animateRotate: true,
                        duration: 750,
                      },
                      plugins: {
                        legend: {
                          position: "top",
                          labels: {
                            color: "#1d1d1f",
                            font: {
                              size: 11,
                            },
                            boxWidth: 10,
                            boxHeight: 10,
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label(context) {
                              const value = context.raw;
                              const total = context.dataset.data.reduce(
                                (a, b) => a + b,
                                0
                              );
                              const percent = total
                                ? ((value / total) * 100).toFixed(1)
                                : 0;
                              return `${context.label}: ${value} (${percent}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </article>

              <article className="rounded-2xl border border-[#e5eaf2] bg-white/90 p-3 shadow-[0_14px_30px_-25px_rgba(15,23,42,0.9)] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 sm:p-4">
                <h2 className="text-sm font-semibold text-[#0f172a] sm:text-base">
                  Job Count
                </h2>

                <div className="mt-2.5 h-[210px] sm:mt-3 sm:h-[250px] lg:h-[285px]">
                  <Bar
                    data={{
                      labels,
                      datasets: [
                        {
                          label: "Jobs",
                          data: values,
                          backgroundColor: "#3b82f6",
                          borderRadius: 8,
                        },
                      ],
                    }}
                    options={{
                      ...baseOptions,
                      animation: {
                        duration: 750,
                      },
                      plugins: {
                        legend: {
                          labels: {
                            color: "#1d1d1f",
                            font: {
                              size: 11,
                            },
                            boxWidth: 10,
                            boxHeight: 10,
                          },
                        },
                      },
                      scales: {
                        x: {
                          ticks: {
                            color: "#475569",
                            font: {
                              size: 10,
                            },
                          },
                          grid: {
                            color: "rgba(100,116,139,0.15)",
                          },
                        },
                        y: {
                          beginAtZero: true,
                          ticks: {
                            color: "#475569",
                            font: {
                              size: 10,
                            },
                          },
                          grid: {
                            color: "rgba(100,116,139,0.15)",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </article>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
