import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Clock,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "./Navbar";
import axiosInstance from "../../axiosInterceptor";

const Notifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get notifications
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

  // Format date
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

  // Mark one notification as read
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

  // Mark all notifications as read
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

  // Delete notification
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

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="min-h-[calc(100vh-72px)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* HEADER */}
          <div className="mb-8">

            {/* BACK TO DASHBOARD */}
            <button
              type="button"
              onClick={() => navigate("/user/dashboard")}
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
                dark:hover:text-[#D76562]
              "
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              {/* TITLE */}
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#B94A48]/10
                    text-[#B94A48]
                    dark:bg-[#D76562]/10
                    dark:text-[#D76562]
                  "
                >
                  <Bell size={22} />
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
                      sm:text-3xl
                    "
                  >
                    Notifications
                  </h1>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Stay updated about your reported cases.
                  </p>
                </div>
              </div>

              {/* MARK ALL AS READ */}
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-border
                    bg-background
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-foreground
                    transition-all
                    duration-200
                    hover:border-[#B94A48]
                    hover:bg-[#B94A48]/5
                    hover:text-[#B94A48]
                    dark:hover:border-[#D76562]
                    dark:hover:bg-[#D76562]/10
                    dark:hover:text-[#D76562]
                  "
                >
                  <CheckCheck size={17} />
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* MAIN CARD */}
          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-border
              bg-card
              shadow-sm
              transition-colors
              duration-300
            "
          >

            {/* CARD HEADER */}
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-border
                px-5
                py-5
              "
            >
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Recent Notifications
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${
                        unreadCount > 1 ? "s" : ""
                      }`
                    : "All notifications are read"}
                </p>
              </div>

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-muted
                  text-muted-foreground
                "
              >
                <Bell size={18} />
              </div>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="px-6 py-16 text-center">
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
            )}

            {/* EMPTY STATE */}
            {!loading && notifications.length === 0 && (
              <div className="px-6 py-16 text-center">
                <div
                  className="
                    mx-auto
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
                  <BellOff size={30} />
                </div>

                <h2 className="mt-5 text-lg font-semibold text-foreground">
                  No Notifications
                </h2>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-md
                    text-sm
                    leading-6
                    text-muted-foreground
                  "
                >
                  You don't have any notifications yet.
                  You will receive updates when there is a
                  change in the status of your reported cases.
                </p>
              </div>
            )}

            {/* NOTIFICATIONS LIST */}
            {!loading && notifications.length > 0 && (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`
                      p-5
                      transition-colors
                      duration-200
                      ${
                        notification.isRead
                          ? "bg-card hover:bg-muted/30"
                          : "bg-muted/40 hover:bg-muted/60"
                      }
                    `}
                  >
                    <div className="flex gap-4">

                      {/* NOTIFICATION ICON */}
                      <div
                        className={`
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          ${
                            notification.isRead
                              ? "bg-muted text-muted-foreground"
                              : "bg-[#B94A48]/10 text-[#B94A48] dark:bg-[#D76562]/10 dark:text-[#D76562]"
                          }
                        `}
                      >
                        <Bell size={19} />
                      </div>

                      {/* NOTIFICATION CONTENT */}
                      <div className="min-w-0 flex-1">

                        {/* TITLE */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">
                            Case Notification
                          </h3>

                          {!notification.isRead && (
                            <span
                              className="
                                rounded-full
                                border
                                border-[#B94A48]/20
                                bg-[#B94A48]/10
                                px-2
                                py-0.5
                                text-[11px]
                                font-medium
                                text-[#B94A48]
                                dark:border-[#D76562]/20
                                dark:bg-[#D76562]/10
                                dark:text-[#D76562]
                              "
                            >
                              New
                            </span>
                          )}
                        </div>

                        {/* MESSAGE */}
                        <p
                          className="
                            mt-2
                            text-sm
                            leading-6
                            text-muted-foreground
                          "
                        >
                          {notification.message}
                        </p>

                        {/* CASE AND DATE */}
                        <div
                          className="
                            mt-3
                            flex
                            flex-wrap
                            items-center
                            gap-4
                            text-xs
                            text-muted-foreground
                          "
                        >

                          {/* CASE ID */}
                          {notification.caseId && (
                            <div className="flex items-center gap-1.5">
                              <FileText size={14} />

                              <span>
                                Case ID:{" "}
                                <span className="font-medium text-foreground">
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
                            aria-label="Mark notification as read"
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-border
                              bg-background
                              text-muted-foreground
                              transition-all
                              duration-200
                              hover:border-[#B94A48]
                              hover:bg-[#B94A48]/5
                              hover:text-[#B94A48]
                              dark:hover:border-[#D76562]
                              dark:hover:bg-[#D76562]/10
                              dark:hover:text-[#D76562]
                            "
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
                          aria-label="Delete notification"
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-border
                            bg-background
                            text-muted-foreground
                            transition-all
                            duration-200
                            hover:border-[#B94A48]
                            hover:bg-[#B94A48]/5
                            hover:text-[#B94A48]
                            dark:hover:border-[#D76562]
                            dark:hover:bg-[#D76562]/10
                            dark:hover:text-[#D76562]
                          "
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