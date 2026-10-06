import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  History,
  FileText,
  User,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

import axiosInstance from "../../axiosInterceptor";

const AdminHistory = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/admin/history")
      .then((response) => {
        setHistory(
          response.data.history ||
            response.data ||
            []
        );

        setLoading(false);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("loginToken");
          localStorage.removeItem("role");
          localStorage.removeItem("userInfo");

          toast.error(
            "Session expired. Please login again."
          );

          navigate("/admin/login");
          return;
        }

        toast.error(
          error.response?.data?.message ||
            "Failed to load history"
        );

        setLoading(false);
      });
  }, [navigate]);

  const getStatusClass = (status) => {
    if (status === "New") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Acknowledged") {
      return "bg-amber-100 text-amber-700";
    }

    if (status === "In Progress") {
      return "bg-purple-100 text-purple-700";
    }

    if (status === "Resolved") {
      return "bg-green-100 text-green-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <Link
              to="/admin/dashboard"
              className="mb-3 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3">
                <History
                  size={24}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Case History
                </h1>

                <p className="text-sm text-slate-500">
                  View the status history of reported cases
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs text-slate-500">
              Total History Records
            </p>

            <p className="text-xl font-bold text-slate-900">
              {history.length}
            </p>
          </div>
        </div>

        {/* History Card */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Status History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              All status changes recorded for crime cases
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center">
              <p className="text-slate-500">
                Loading history...
              </p>
            </div>
          ) : history.length === 0 ? (
            <div className="p-10 text-center">
              <History
                size={40}
                className="mx-auto mb-3 text-slate-300"
              />

              <p className="text-slate-500">
                No history records found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">

                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Case ID
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Updated
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {history.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >

                      {/* Case ID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText
                            size={17}
                            className="text-blue-600"
                          />

                          <span className="font-semibold text-slate-900">
                            {item.caseId?.caseId ||
                              "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">
                          {item.caseId?.crimeCategory ||
                            "N/A"}
                        </span>
                      </td>

                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                            <User
                              size={17}
                              className="text-slate-500"
                            />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {item.caseId?.userId?.name ||
                                "N/A"}
                            </p>

                            <p className="text-xs text-slate-500">
                              {item.caseId?.userId?.phone ||
                                ""}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">

                          <Clock size={16} />

                          {item.updatedDateTime
                            ? new Date(
                                item.updatedDateTime
                              ).toLocaleString()
                            : "N/A"}

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHistory;