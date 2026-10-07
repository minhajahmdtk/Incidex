import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "./Navbar";
import axiosInstance from "../../axiosInterceptor";

const Dashboard = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/cases/my-cases")
      .then((response) => {
        console.log(response.data);

        setCases(response.data.cases || response.data);
      })
      .catch((error) => {
        console.log(error);

        toast.error(
          error.response?.data?.message || "Failed to load cases"
        );
      });
  }, []);

  const totalCases = cases.length;

  const newCases = cases.filter(
    (item) => item.currentStatus === "New"
  ).length;

  const inProgressCases = cases.filter(
    (item) => item.currentStatus === "In Progress"
  ).length;

  const resolvedCases = cases.filter(
    (item) => item.currentStatus === "Resolved"
  ).length;

  const recentCases = cases
    .slice()
    .sort((a, b) => {
      return (
        new Date(b.reportDateTime || b.createdAt) -
        new Date(a.reportDateTime || a.createdAt)
      );
    })
    .slice(0, 5);

  const getStatusStyle = (status) => {
    if (status === "New") {
      return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }

    if (status === "Acknowledged") {
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900";
    }

    if (status === "In Progress") {
      return "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700";
    }

    if (status === "Resolved") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900";
    }

    return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="min-h-screen">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* Header */}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                Welcome back
              </p>

              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                Dashboard
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Track your reported incidents and stay updated.
              </p>
            </div>

            {/* Report Crime Button */}

            <Link
              to="/user/report"
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-lg
                bg-[#151A21]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition-all
                duration-200
                hover:bg-[#343A40]
                dark:bg-[#E5E7EB]
                dark:text-[#151A21]
                dark:hover:bg-[#FFFFFF]
              "
            >
              <Plus size={18} />
              Report Crime
            </Link>
          </div>

          {/* Statistics */}

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total Cases */}

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Cases
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-foreground">
                    {totalCases}
                  </h2>
                </div>

                <div className="rounded-lg bg-muted p-3">
                  <FileText
                    size={24}
                    className="text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* New Cases */}

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    New Cases
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-foreground">
                    {newCases}
                  </h2>
                </div>

                <div className="rounded-lg bg-muted p-3">
                  <AlertCircle
                    size={24}
                    className="text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* In Progress */}

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    In Progress
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-foreground">
                    {inProgressCases}
                  </h2>
                </div>

                <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
                  <Clock
                    size={24}
                    className="text-amber-700 dark:text-amber-300"
                  />
                </div>
              </div>
            </div>

            {/* Resolved */}

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Resolved
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-foreground">
                    {resolvedCases}
                  </h2>
                </div>

                <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/30">
                  <CheckCircle
                    size={24}
                    className="text-emerald-700 dark:text-emerald-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Cases */}

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">

            {/* Recent Cases Header */}

            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Recent Cases
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your latest reported incidents
                </p>
              </div>

              <Link
                to="/user/cases"
                className="
                  flex
                  items-center
                  gap-1
                  text-sm
                  font-medium
                  text-foreground
                  transition-colors
                  hover:text-muted-foreground
                "
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* No Cases */}

            {recentCases.length === 0 ? (
              <div className="px-5 py-12 text-center">

                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <FileText
                    size={24}
                    className="text-muted-foreground"
                  />
                </div>

                <h3 className="text-base font-semibold text-foreground">
                  No cases reported yet
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your reported incidents will appear here.
                </p>

                {/* Report Crime Button */}

                <Link
                  to="/user/report"
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-[#151A21]
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition-all
                    duration-200
                    hover:bg-[#343A40]
                    dark:bg-[#E5E7EB]
                    dark:text-[#151A21]
                    dark:hover:bg-[#FFFFFF]
                  "
                >
                  <Plus size={17} />
                  Report Crime
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">

                  {/* Table Header */}

                  <thead>
                    <tr className="bg-muted/50">

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Case ID
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Category
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Location
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Date
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Status
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Action
                      </th>

                    </tr>
                  </thead>

                  {/* Table Body */}

                  <tbody>
                    {recentCases.map((item) => (
                      <tr
                        key={item._id}
                        className="
                          border-t
                          border-border/60
                          transition-colors
                          hover:bg-muted/40
                        "
                      >

                        <td className="px-5 py-4 text-sm font-semibold text-foreground">
                          {item.caseId}
                        </td>

                        <td className="px-5 py-4 text-sm text-foreground">
                          {item.crimeCategory}
                        </td>

                        <td className="max-w-xs px-5 py-4 text-sm text-muted-foreground">
                          <span className="block truncate">
                            {item.incidentLocation}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                          {new Date(
                            item.reportDateTime || item.createdAt
                          ).toLocaleDateString("en-IN")}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`
                              rounded-full
                              border
                              px-3
                              py-1
                              text-xs
                              font-medium
                              ${getStatusStyle(item.currentStatus)}
                            `}
                          >
                            {item.currentStatus}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <Link
                            to={`/user/cases/${item.caseId}`}
                            className="
                              text-sm
                              font-medium
                              text-foreground
                              transition-colors
                              hover:text-muted-foreground
                            "
                          >
                            View
                          </Link>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;