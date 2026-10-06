import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageSquare,
  User,
  Mail,
  Phone,
  FileText,
  Eye,
  Trash2,
  X,
} from "lucide-react";
import axiosInstance from "../../axiosInterceptor";
import { toast } from "sonner";

const AdminFeedback = () => {
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/admin/feedback")
      .then((response) => {
        setFeedback(
          response.data.feedback ||
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
            "Failed to load feedback"
        );

        setLoading(false);
      });
  }, [navigate]);

  const deleteFeedback = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this feedback?"
    );

    if (!confirmDelete) {
      return;
    }

    setDeletingId(id);

    axiosInstance
      .delete(`/admin/feedback/${id}`)
      .then((response) => {
        setFeedback((prev) =>
          prev.filter((item) => item._id !== id)
        );

        setSelectedFeedback(null);

        toast.success(
          response.data.message ||
            "Feedback deleted successfully"
        );
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
            "Failed to delete feedback"
        );
      })
      .finally(() => {
        setDeletingId("");
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div>

            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 mb-3"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-3">

              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageSquare
                  size={24}
                  className="text-blue-600"
                />
              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900">
                  Feedback
                </h1>

                <p className="text-sm text-slate-500">
                  View feedback submitted by users
                </p>

              </div>

            </div>

          </div>

          <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">

            <p className="text-xs text-slate-500">
              Total Feedback
            </p>

            <p className="text-xl font-bold text-slate-900">
              {feedback.length}
            </p>

          </div>

        </div>

        {/* Feedback Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

          <div className="px-6 py-4 border-b border-slate-200">

            <h2 className="text-lg font-semibold text-slate-900">
              User Feedback
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Feedback submitted for resolved cases
            </p>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="p-10 text-center">

              <p className="text-slate-500">
                Loading feedback...
              </p>

            </div>
          ) : feedback.length === 0 ? (
            <div className="p-10 text-center">

              <MessageSquare
                size={40}
                className="mx-auto text-slate-300 mb-3"
              />

              <p className="text-slate-500">
                No feedback has been submitted yet.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-slate-50 border-b border-slate-200">

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      User Name
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Phone
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Case ID
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {feedback.map((item) => (

                    <tr
                      key={item._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >

                      {/* User Name */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">

                            <User
                              size={18}
                              className="text-blue-600"
                            />

                          </div>

                          <p className="font-medium text-slate-900">
                            {item.userId?.name || "N/A"}
                          </p>

                        </div>

                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-sm text-slate-600">

                          <Phone size={16} />

                          {item.userId?.phone || "N/A"}

                        </div>

                      </td>

                      {/* Case ID */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2">

                          <FileText
                            size={16}
                            className="text-slate-500"
                          />

                          <span className="font-medium text-slate-900">
                            {item.caseId?.caseId || "N/A"}
                          </span>

                        </div>

                      </td>

                      {/* View */}
                      <td className="px-6 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedFeedback(item)
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                        >

                          <Eye size={16} />

                          View

                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

      {/* View Feedback Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

          <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">

              <div>

                <h2 className="text-xl font-semibold text-slate-900">
                  Feedback Details
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {selectedFeedback.caseId?.caseId || "N/A"}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedFeedback(null)
                }
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              >

                <X size={20} />

              </button>

            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">

              {/* User Information */}
              <div className="bg-slate-50 rounded-lg p-4">

                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  User Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>

                    <p className="text-xs text-slate-500 mb-1">
                      Name
                    </p>

                    <div className="flex items-center gap-2">

                      <User
                        size={16}
                        className="text-slate-500"
                      />

                      <p className="text-sm font-medium text-slate-900">
                        {selectedFeedback.userId?.name ||
                          "N/A"}
                      </p>

                    </div>

                  </div>

                  <div>

                    <p className="text-xs text-slate-500 mb-1">
                      Phone
                    </p>

                    <div className="flex items-center gap-2">

                      <Phone
                        size={16}
                        className="text-slate-500"
                      />

                      <p className="text-sm text-slate-700">
                        {selectedFeedback.userId?.phone ||
                          "N/A"}
                      </p>

                    </div>

                  </div>

                  <div className="sm:col-span-2">

                    <p className="text-xs text-slate-500 mb-1">
                      Email
                    </p>

                    <div className="flex items-center gap-2">

                      <Mail
                        size={16}
                        className="text-slate-500"
                      />

                      <p className="text-sm text-slate-700 break-all">
                        {selectedFeedback.userId?.email ||
                          "N/A"}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* Case Information */}
              <div>

                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Case Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>

                    <p className="text-xs text-slate-500 mb-1">
                      Case ID
                    </p>

                    <p className="text-sm font-medium text-slate-900">
                      {selectedFeedback.caseId?.caseId ||
                        "N/A"}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-slate-500 mb-1">
                      Crime Category
                    </p>

                    <p className="text-sm text-slate-700">
                      {selectedFeedback.caseId
                        ?.crimeCategory || "N/A"}
                    </p>

                  </div>

                </div>

              </div>

              {/* Feedback */}
              <div>

                <p className="text-sm font-semibold text-slate-900 mb-2">
                  Feedback
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">

                  <p className="text-sm text-slate-700 leading-6">
                    {selectedFeedback.feedbackDetails ||
                      "No feedback details"}
                  </p>

                </div>

              </div>

              {/* Submitted Date */}
              <div>

                <p className="text-xs text-slate-500 mb-1">
                  Submitted Date & Time
                </p>

                <p className="text-sm text-slate-700">
                  {selectedFeedback.submittedDateTime
                    ? new Date(
                        selectedFeedback.submittedDateTime
                      ).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </p>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">

              <button
                type="button"
                onClick={() =>
                  setSelectedFeedback(null)
                }
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() =>
                  deleteFeedback(
                    selectedFeedback._id
                  )
                }
                disabled={
                  deletingId === selectedFeedback._id
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >

                <Trash2 size={16} />

                {deletingId === selectedFeedback._id
                  ? "Deleting..."
                  : "Delete Feedback"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminFeedback;