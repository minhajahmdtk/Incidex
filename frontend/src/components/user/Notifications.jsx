import { useEffect, useState } from "react";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Clock,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "./Navbar";
import axiosInstance from "../../axiosInterceptor";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // GET NOTIFICATIONS
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await axiosInstance.get(
          "/user-notifications/"
        );

        setNotifications(response.data.notifications || []);
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to load notifications";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    getNotifications();
  }, []);

  // FORMAT DATE
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

  // MARK ONE NOTIFICATION AS READ
  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(
        `/user-notifications/read/${id}`
      );

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );

      toast.success("Notification marked as read");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to mark notification as read";

      toast.error(message);
    }
  };

  // MARK ALL NOTIFICATIONS AS READ
  const markAllAsRead = async () => {
    try {
      await axiosInstance.put(
        "/user-notifications/read-all"
      );

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      toast.success("All notifications marked as read");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to mark notifications as read";

      toast.error(message);
    }
  };

  // DELETE NOTIFICATION
  const deleteNotification = async (id) => {
    try {
      await axiosInstance.delete(
        `/user-notifications/${id}`
      );

      setNotifications((previousNotifications) =>
        previousNotifications.filter(
          (notification) => notification._id !== id
        )
      );

      toast.success("Notification deleted");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to delete notification";

      toast.error(message);
    }
  };

  // COUNT UNREAD NOTIFICATIONS
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="min-h-screen lg:ml-72">
        <div className="px-4 py-6 sm:px-6 lg:px-8">

          {/* HEADER */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Bell size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Notifications
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Stay updated about your reported cases.
                </p>
              </div>
            </div>

            {/* MARK ALL AS READ */}
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
              >
                <CheckCheck size={17} />
                Mark all as read
              </button>
            )}
          </div>

          {/* MAIN CARD */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* CARD HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Recent Notifications
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${
                        unreadCount > 1 ? "s" : ""
                      }`
                    : "All notifications are read"}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Bell size={18} />
              </div>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="px-6 py-16 text-center">

                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

                <p className="text-sm text-slate-500">
                  Loading notifications...
                </p>

              </div>
            )}

            {/* EMPTY STATE */}
            {!loading && notifications.length === 0 && (
              <div className="px-6 py-16 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <BellOff
                    size={30}
                    className="text-slate-400"
                  />
                </div>

                <h2 className="mt-5 text-lg font-semibold text-slate-900">
                  No Notifications
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  You don't have any notifications yet.
                  You will receive updates when there is a
                  change in the status of your reported cases.
                </p>

              </div>
            )}

            {/* NOTIFICATIONS LIST */}
            {!loading && notifications.length > 0 && (
              <div className="divide-y divide-slate-200">

                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-5 transition ${
                      notification.isRead
                        ? "bg-white"
                        : "bg-blue-50/40"
                    }`}
                  >

                    <div className="flex gap-4">

                      {/* NOTIFICATION ICON */}
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          notification.isRead
                            ? "bg-slate-100 text-slate-500"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        <Bell size={19} />
                      </div>

                      {/* NOTIFICATION CONTENT */}
                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-sm font-semibold text-slate-900">
                            Case Notification
                          </h3>

                          {!notification.isRead && (
                            <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                              New
                            </span>
                          )}

                        </div>

                        {/* MESSAGE */}
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {notification.message}
                        </p>

                        {/* CASE AND DATE */}
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">

                          {/* CASE ID */}
                          {notification.caseId && (
                            <div className="flex items-center gap-1.5">
                              <FileText size={14} />

                              <span>
                                Case ID:{" "}
                                <span className="font-medium text-slate-700">
                                  {notification.caseId.caseId ||
                                    notification.caseId}
                                </span>
                              </span>
                            </div>
                          )}

                          {/* DATE */}
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} />

                            <span>
                              {formatDate(
                                notification.createdDateTime
                              )}
                            </span>
                          </div>

                        </div>

                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex shrink-0 items-start gap-2">

                        {/* MARK AS READ */}
                        {!notification.isRead && (
                          <button
                            type="button"
                            onClick={() =>
                              markAsRead(notification._id)
                            }
                            title="Mark as read"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Check size={17} />
                          </button>
                        )}

                        {/* DELETE */}
                        <button
                          type="button"
                          onClick={() =>
                            deleteNotification(
                              notification._id
                            )
                          }
                          title="Delete notification"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;