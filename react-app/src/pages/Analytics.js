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

export default function Analytics() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await API.get("/jobs");
    setJobs(res.data);
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
    <div className="relative min-h-screen overflow-hidden bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(231,240,255,0.7)_46%,_rgba(245,245,247,1)_78%)]" />

      <div className="relative flex min-h-screen">
        <Sidebar />

        <main className="flex-1 overflow-y-auto px-5 py-8 lg:px-10">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <header>
              <h1 className="text-4xl font-semibold tracking-tight text-[#1d1d1f]">
                Analytics
              </h1>
              <p className="mt-2 text-sm text-[#6e7781]">
                Monitor application flow and progress by stage.
              </p>
            </header>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <article className="rounded-[24px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
                <h2 className="text-lg font-semibold text-[#1d1d1f]">
                  Status Distribution
                </h2>

                <div className="mt-4 h-[320px]">
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
                      cutout: "64%",
                      animation: {
                        animateRotate: true,
                        duration: 900,
                      },
                      plugins: {
                        legend: {
                          position: "top",
                          labels: {
                            color: "#1d1d1f",
                            font: {
                              size: 12,
                            },
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

              <article className="rounded-[24px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
                <h2 className="text-lg font-semibold text-[#1d1d1f]">
                  Job Count
                </h2>

                <div className="mt-4 h-[320px]">
                  <Bar
                    data={{
                      labels,
                      datasets: [
                        {
                          label: "Jobs",
                          data: values,
                          backgroundColor: "#3b82f6",
                          borderRadius: 10,
                        },
                      ],
                    }}
                    options={{
                      ...baseOptions,
                      animation: {
                        duration: 900,
                      },
                      plugins: {
                        legend: {
                          labels: {
                            color: "#1d1d1f",
                            font: {
                              size: 12,
                            },
                          },
                        },
                      },
                      scales: {
                        x: {
                          ticks: {
                            color: "#475569",
                          },
                          grid: {
                            color: "rgba(100,116,139,0.15)",
                          },
                        },
                        y: {
                          beginAtZero: true,
                          ticks: {
                            color: "#475569",
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
