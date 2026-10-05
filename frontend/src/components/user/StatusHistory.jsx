import { useEffect, useState } from "react";
import {
  Search,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  History,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "./Navbar";
import axiosInstance from "../../axiosInterceptor";

const StatusHistory = () => {
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
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
        return <CheckCircle size={17} />;

      case "In Progress":
        return <Clock size={17} />;

      case "Acknowledged":
        return <AlertCircle size={17} />;

      default:
        return <FileText size={17} />;
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const viewHistory = async (caseItem) => {
    try {
      setSelectedCase(caseItem);
      setHistory([]);
      setHistoryLoading(true);

      const response = await axiosInstance.get(
        `/cases/history/${caseItem.caseId}`
      );

      setHistory(response.data.history || []);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to load status history";

      toast.error(message);
      setSelectedCase(null);
    } finally {
      setHistoryLoading(false);
    }
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
              Status History
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View the status history of your reported cases.
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
            </div>
          )}

          {/* No Cases */}
          {!loading &&
            !errorMessage &&
            cases.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <History
                    size={26}
                    className="text-slate-500"
                  />
                </div>

                <h2 className="text-lg font-semibold text-slate-900">
                  No Status History
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  You have not reported any crime incidents yet.
                </p>

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

          {/* Case List */}
          {!loading &&
            !errorMessage &&
            filteredCases.length > 0 && (
              <div className="space-y-4">

                {filteredCases.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      {/* Case Information */}
                      <div>
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
                          {formatDate(item.reportDateTime)}
                        </p>
                      </div>

                      {/* View History */}
                      <button
                        type="button"
                        onClick={() => viewHistory(item)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 lg:w-auto"
                      >
                        <History size={17} />
                        View History
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

          {/* Selected Case Status History */}
          {selectedCase && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Status History
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedCase.caseId} ·{" "}
                    {selectedCase.crimeCategory}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCase(null);
                    setHistory([]);
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>

              </div>

              {/* History Loading */}
              {historyLoading && (
                <div className="rounded-xl bg-slate-50 p-8 text-center">
                  <p className="text-sm text-slate-500">
                    Loading status history...
                  </p>
                </div>
              )}

              {/* History */}
              {!historyLoading && history.length > 0 && (
                <div className="space-y-5">

                  {history.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="relative flex gap-4"
                    >

                      {/* Timeline */}
                      <div className="flex flex-col items-center">

                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full border ${getStatusStyle(
                            item.status
                          )}`}
                        >
                          {getStatusIcon(item.status)}
                        </div>

                        {index !== history.length - 1 && (
                          <div className="mt-2 h-full min-h-8 w-px bg-slate-200" />
                        )}

                      </div>

                      {/* History Information */}
                      <div className="pb-4">

                        <h3 className="text-sm font-semibold text-slate-900">
                          {item.status}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(item.updatedDateTime)}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>
              )}

              {/* No History */}
              {!historyLoading && history.length === 0 && (
                <div className="rounded-xl bg-slate-50 p-8 text-center">
                  <FileText
                    size={28}
                    className="mx-auto text-slate-400"
                  />

                  <p className="mt-3 text-sm text-slate-500">
                    No status history available for this case.
                  </p>
                </div>
              )}

            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default StatusHistory;