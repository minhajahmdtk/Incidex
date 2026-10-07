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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              to="/admin/dashboard"
              className="
                mb-5
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-muted-foreground
                transition-colors
                hover:text-[#B94A48]
              "
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#B94A48]/10
                  text-[#B94A48]
                  dark:bg-[#D76562]/10
                  dark:text-[#D76562]
                "
              >
                <Bell size={23} />
              </div>

              <div>
                <h1
                  className="
                    bg-gradient-to-r
                    from-[#B94A48]
                    via-[#7FAF8A]
                    to-[#555C64]
                    bg-clip-text
                    text-2xl
                    font-bold
                    tracking-tight
                    text-transparent
                  "
                >
                  Notifications
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  New crime reports and system notifications
                </p>
              </div>
            </div>
          </div>

          {/* HEADER ACTIONS */}
          <div className="flex items-center gap-3">
            <div
              className="
                rounded-xl
                border
                border-border
                bg-card
                px-5
                py-3
              "
            >
              <p className="text-xs text-muted-foreground">
                Unread
              </p>

              <p className="text-xl font-bold text-foreground">
                {unreadCount}
              </p>
            </div>

            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                bg-[#B94A48]
                px-4
                py-3
                text-sm
                font-medium
                text-white
                transition-colors
                hover:bg-[#A33F3D]
                disabled:cursor-not-allowed
                disabled:opacity-40
                dark:bg-[#D76562]
                dark:hover:bg-[#C55451]
              "
            >
              <CheckCheck size={17} />
              Mark All Read
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS CARD */}
        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-card
            transition-colors
            duration-300
          "
        >
          {/* CARD HEADER */}
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-lg font-semibold text-foreground">
              All Notifications
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Notifications generated when users report crimes
            </p>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="p-12 text-center">
              <div
                className="
                  mx-auto
                  mb-4
                  h-8
                  w-8
                  animate-spin
                  rounded-full
                  border-2
                  border-border
                  border-t-[#B94A48]
                  dark:border-t-[#D76562]
                "
              />

              <p className="text-sm text-muted-foreground">
                Loading notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            /* EMPTY STATE */
            <div className="p-12 text-center">
              <div
                className="
                  mx-auto
                  mb-4
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-muted
                  text-muted-foreground
                "
              >
                <Bell size={30} />
              </div>

              <p className="text-sm text-muted-foreground">
                No notifications found.
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`
                    border-b
                    border-border
                    p-6
                    transition-colors
                    last:border-b-0
                    ${
                      !notification.isRead
                        ? "bg-[#B94A48]/5 dark:bg-[#D76562]/5"
                        : "bg-card"
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      flex-col
                      gap-5
                      lg:flex-row
                      lg:items-start
                      lg:justify-between
                    "
                  >
                    {/* NOTIFICATION DETAILS */}
                    <div className="flex min-w-0 gap-4">
                      <div
                        className={`
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          ${
                            notification.isRead
                              ? "bg-muted text-muted-foreground"
                              : "bg-[#B94A48]/10 text-[#B94A48] dark:bg-[#D76562]/10 dark:text-[#D76562]"
                          }
                        `}
                      >
                        <Bell size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* TITLE */}
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-foreground">
                            New Crime Report
                          </h3>

                          {!notification.isRead && (
                            <span
                              className="
                                rounded-full
                                bg-[#B94A48]/10
                                px-2
                                py-1
                                text-xs
                                font-medium
                                text-[#B94A48]
                                dark:bg-[#D76562]/10
                                dark:text-[#D76562]
                              "
                            >
                              New
                            </span>
                          )}
                        </div>

                        <p className="mb-5 text-sm text-muted-foreground">
                          A new crime case has been reported by a user.
                        </p>

                        {/* DETAILS */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                          {/* USER */}
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-muted
                                text-muted-foreground
                              "
                            >
                              <User size={16} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground">
                                User
                              </p>

                              <p className="truncate text-sm font-medium text-foreground">
                                {notification.userId?.name || "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* PHONE */}
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-muted
                                text-muted-foreground
                              "
                            >
                              <User size={16} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground">
                                Phone
                              </p>

                              <p className="text-sm font-medium text-foreground">
                                {notification.userId?.phone || "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* CASE */}
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-muted
                                text-muted-foreground
                              "
                            >
                              <FileText size={16} />
                            </div>

                            <div>
                              <p className="text-xs text-muted-foreground">
                                Case ID
                              </p>

                              <p className="text-sm font-medium text-foreground">
                                {notification.caseId?.caseId || "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* CATEGORY */}
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Crime Category
                            </p>

                            <p className="text-sm font-medium text-foreground">
                              {notification.caseId?.crimeCategory ||
                                "N/A"}
                            </p>
                          </div>

                          {/* STATUS */}
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Current Status
                            </p>

                            <span
                              className={`
                                mt-1
                                inline-flex
                                rounded-full
                                px-2.5
                                py-1
                                text-xs
                                font-medium
                                ${
                                  notification.caseId?.currentStatus ===
                                  "Resolved"
                                    ? "bg-[#7FAF8A]/15 text-[#5F8D6A] dark:text-[#9BC7A4]"
                                    : notification.caseId
                                          ?.currentStatus ===
                                        "In Progress"
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-[#B94A48]/10 text-[#B94A48] dark:bg-[#D76562]/10 dark:text-[#D76562]"
                                }
                              `}
                            >
                              {notification.caseId?.currentStatus ||
                                "New"}
                            </span>
                          </div>

                          {/* DATE */}
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Date & Time
                            </p>

                            <p className="text-sm font-medium text-foreground">
                              {notification.createdDateTime
                                ? new Date(
                                    notification.createdDateTime
                                  ).toLocaleString("en-IN")
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MARK READ */}
                    {!notification.isRead ? (
                      <button
                        type="button"
                        onClick={() =>
                          markAsRead(notification._id)
                        }
                        className="
                          inline-flex
                          shrink-0
                          items-center
                          justify-center
                          gap-2
                          rounded-lg
                          border
                          border-border
                          bg-background
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-foreground
                          transition-colors
                          hover:bg-accent
                          hover:text-accent-foreground
                        "
                      >
                        <Check size={16} />
                        Mark as Read
                      </button>
                    ) : (
                      <span
                        className="
                          flex
                          shrink-0
                          items-center
                          gap-2
                          text-sm
                          text-muted-foreground
                        "
                      >
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
      </main>
    </div>
  );
};

export default AdminNotifications;