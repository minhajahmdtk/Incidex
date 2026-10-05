import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "./Navbar";
import axiosInstance from "../../axiosInterceptor";

const MyCases = () => {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getMyCases = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await axiosInstance.get(
          "/cases/my-cases"
        );

        setCases(response.data.cases || []);
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to load your cases";

        setErrorMessage(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    getMyCases();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Acknowledged":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "In Progress":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "Resolved":
        return "bg-green-50 text-green-700 border-green-200";

      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle size={16} />;

      case "In Progress":
        return <Clock size={16} />;

      case "Acknowledged":
        return <AlertCircle size={16} />;

      default:
        return <FileText size={16} />;
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredCases = cases.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.caseId?.toLowerCase().includes(searchText) ||
      item.crimeCategory?.toLowerCase().includes(searchText) ||
      item.currentStatus?.toLowerCase().includes(searchText) ||
      item.incidentLocation?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="min-h-screen lg:ml-72">
        <div className="px-4 py-6 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              My Cases
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and track all your reported crime incidents.
            </p>
          </div>

          {/* Search */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="relative max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
                placeholder="Search by case ID, category or location..."
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-slate-500">
                Loading your cases...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && errorMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="text-sm text-red-600">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* No Cases */}
          {!loading &&
            !errorMessage &&
            cases.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <FileText
                    size={26}
                    className="text-slate-500"
                  />
                </div>

                <h2 className="text-lg font-semibold text-slate-900">
                  No Cases Found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  You have not reported any crime incidents yet.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/user/report")}
                  className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Report Crime
                </button>

              </div>
            )}

          {/* No Search Results */}
          {!loading &&
            !errorMessage &&
            cases.length > 0 &&
            filteredCases.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                <Search
                  size={28}
                  className="mx-auto text-slate-400"
                />

                <h2 className="mt-3 text-lg font-semibold text-slate-900">
                  No Matching Cases
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Try another case ID, category or location.
                </p>

              </div>
            )}

          {/* Cases */}
          {!loading &&
            !errorMessage &&
            filteredCases.length > 0 && (
              <div className="space-y-4">

                {filteredCases.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      {/* Case Information */}
                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-3">

                          <h2 className="text-lg font-semibold text-slate-900">
                            {item.caseId}
                          </h2>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                              item.currentStatus
                            )}`}
                          >
                            {getStatusIcon(
                              item.currentStatus
                            )}

                            {item.currentStatus}
                          </span>

                        </div>

                        <p className="mt-2 text-sm font-medium text-slate-700">
                          {item.crimeCategory}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {item.incidentLocation}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          Reported on{" "}
                          {formatDate(
                            item.reportDateTime
                          )}
                        </p>

                      </div>

                      {/* View Details */}
                      <div className="flex-shrink-0">

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/user/cases/${item.caseId}`
                            )
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 lg:w-auto"
                        >
                          <Eye size={17} />
                          View Details
                        </button>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

        </div>
      </main>
    </div>
  );
};

export default MyCases;