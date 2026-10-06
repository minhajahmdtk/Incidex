import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  User,
  FileText,
} from "lucide-react";
import axiosInstance from "../../axiosInterceptor";
import { toast } from "sonner";

const AdminNotifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/admin/notifications")
      .then((response) => {
        setNotifications(
          response.data.notifications || response.data || []
        );
        setLoading(false);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("loginToken");
          localStorage.removeItem("role");
          localStorage.removeItem("userInfo");

          toast.error("Session expired. Please login again.");

          navigate("/admin/login");
          return;
        }

        toast.error(
          error.response?.data?.message ||
            "Failed to load notifications"
        );

        setLoading(false);
      });
  }, [navigate]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const markAsRead = (id) => {
    axiosInstance
      .patch(`/admin/notifications/read/${id}`)
      .then(() => {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === id
              ? { ...notification, isRead: true }
              : notification
          )
        );

        toast.success("Notification marked as read");
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("loginToken");
          localStorage.removeItem("role");
          localStorage.removeItem("userInfo");

          toast.error("Session expired. Please login again.");

          navigate("/admin/login");
          return;
        }

        toast.error(
          error.response?.data?.message ||
            "Failed to mark notification as read"
        );
      });
  };

  const markAllAsRead = () => {
    if (unreadCount === 0) {
      return;
    }

    axiosInstance
      .patch("/admin/notifications/read-all")
      .then(() => {
        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );

        toast.success("All notifications marked as read");
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("loginToken");
          localStorage.removeItem("role");
          localStorage.removeItem("userInfo");

          toast.error("Session expired. Please login again.");

          navigate("/admin/login");
          return;
        }

        toast.error(
          error.response?.data?.message ||
            "Failed to mark notifications as read"
        );
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">

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
                <Bell size={24} className="text-blue-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Notifications
                </h1>

                <p className="text-sm text-slate-500">
                  New crime reports and system notifications
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
              <p className="text-xs text-slate-500">
                Unread
              </p>

              <p className="text-xl font-bold text-slate-900">
                {unreadCount}
              </p>
            </div>

            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
            >
              <CheckCheck size={17} />
              Mark All Read
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              All Notifications
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Notifications generated when users report crimes
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center">
              <p className="text-slate-500">
                Loading notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-10 text-center">
              <Bell
                size={40}
                className="mx-auto text-slate-300 mb-3"
              />

              <p className="text-slate-500">
                No notifications found.
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-6 border-b border-slate-100 ${
                    !notification.isRead
                      ? "bg-blue-50/50"
                      : "bg-white"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                    {/* Notification Details */}
                    <div className="flex gap-4">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                          notification.isRead
                            ? "bg-slate-100"
                            : "bg-blue-100"
                        }`}
                      >
                        <Bell
                          size={20}
                          className={
                            notification.isRead
                              ? "text-slate-500"
                              : "text-blue-600"
                          }
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900">
                            New Crime Report
                          </h3>

                          {!notification.isRead && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                              New
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-slate-500 mb-4">
                          A new crime case has been reported by a user.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                          {/* User */}
                          <div className="flex items-center gap-2">
                            <User
                              size={16}
                              className="text-slate-400"
                            />

                            <div>
                              <p className="text-xs text-slate-400">
                                User
                              </p>

                              <p className="text-sm font-medium text-slate-700">
                                {notification.userId?.name || "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* Phone */}
                          <div className="flex items-center gap-2">
                            <User
                              size={16}
                              className="text-slate-400"
                            />

                            <div>
                              <p className="text-xs text-slate-400">
                                Phone
                              </p>

                              <p className="text-sm font-medium text-slate-700">
                                {notification.userId?.phone || "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* Case */}
                          <div className="flex items-center gap-2">
                            <FileText
                              size={16}
                              className="text-slate-400"
                            />

                            <div>
                              <p className="text-xs text-slate-400">
                                Case ID
                              </p>

                              <p className="text-sm font-medium text-slate-700">
                                {notification.caseId?.caseId || "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* Category */}
                          <div>
                            <p className="text-xs text-slate-400">
                              Crime Category
                            </p>

                            <p className="text-sm font-medium text-slate-700">
                              {notification.caseId?.crimeCategory ||
                                "N/A"}
                            </p>
                          </div>

                          {/* Status */}
                          <div>
                            <p className="text-xs text-slate-400">
                              Current Status
                            </p>

                            <span className="inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              {notification.caseId?.currentStatus ||
                                "New"}
                            </span>
                          </div>

                          {/* Date */}
                          <div>
                            <p className="text-xs text-slate-400">
                              Date & Time
                            </p>

                            <p className="text-sm font-medium text-slate-700">
                              {notification.createdDateTime
                                ? new Date(
                                    notification.createdDateTime
                                  ).toLocaleString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mark Read */}
                    {!notification.isRead && (
                      <button
                        type="button"
                        onClick={() =>
                          markAsRead(notification._id)
                        }
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition shrink-0"
                      >
                        <Check size={16} />
                        Mark as Read
                      </button>
                    )}

                    {notification.isRead && (
                      <span className="text-sm text-slate-400 flex items-center gap-2">
                        <Check size={16} />
                        Read
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;