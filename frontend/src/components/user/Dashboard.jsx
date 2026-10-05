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
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (status === "Acknowledged") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (status === "In Progress") {
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }

    if (status === "Resolved") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="lg:ml-72 min-h-screen">
        <div className="px-4 py-6 sm:px-6 lg:px-8">

          {/* Header */}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-slate-500">
                Welcome back
              </p>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Dashboard
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                Track your reported incidents and stay updated.
              </p>
            </div>

            <Link
              to="/user/report"
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Report Crime
            </Link>
          </div>

          {/* Statistics */}

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total Cases */}

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Cases
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {totalCases}
                  </h2>
                </div>

                <div className="rounded-lg bg-blue-50 p-3">
                  <FileText
                    size={24}
                    className="text-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* New Cases */}

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    New Cases
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {newCases}
                  </h2>
                </div>

                <div className="rounded-lg bg-blue-50 p-3">
                  <AlertCircle
                    size={24}
                    className="text-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* In Progress */}

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    In Progress
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {inProgressCases}
                  </h2>
                </div>

                <div className="rounded-lg bg-amber-50 p-3">
                  <Clock
                    size={24}
                    className="text-amber-600"
                  />
                </div>
              </div>
            </div>

            {/* Resolved */}

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Resolved
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {resolvedCases}
                  </h2>
                </div>

                <div className="rounded-lg bg-green-50 p-3">
                  <CheckCircle
                    size={24}
                    className="text-green-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Cases */}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Cases
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest reported incidents
                </p>
              </div>

              <Link
                to="/user/cases"
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* No Cases */}

            {recentCases.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <FileText
                    size={24}
                    className="text-slate-400"
                  />
                </div>

                <h3 className="text-base font-semibold text-slate-900">
                  No cases reported yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your reported incidents will appear here.
                </p>

                <Link
                  to="/user/report"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Report Crime
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Case ID
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Location
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Date
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentCases.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                          {item.caseId}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {item.crimeCategory}
                        </td>

                        <td className="max-w-xs px-5 py-4 text-sm text-slate-600">
                          <span className="block truncate">
                            {item.incidentLocation}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                          {new Date(
                            item.reportDateTime || item.createdAt
                          ).toLocaleDateString("en-IN")}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                              item.currentStatus
                            )}`}
                          >
                            {item.currentStatus}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <Link
                            to={`/user/cases/${item.caseId}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
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