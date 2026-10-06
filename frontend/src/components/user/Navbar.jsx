import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  X,
  LayoutDashboard,
  FilePlus,
  FolderOpen,
  Bell,
  User,
  LogOut,
  ShieldCheck,
  Moon,
  Sun,
} from "lucide-react";

import axiosInstance from "../../axiosInterceptor";
import { toast } from "sonner";

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("userInfo");

    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("loginToken");
  const role = localStorage.getItem("role");
  const user = getStoredUser();

  /*
    Check whether the current page
    belongs to the logged-in user.
  */
  const isUserPage = location.pathname.startsWith("/user");

  const isLoggedIn = Boolean(
    token &&
    role === "user" &&
    isUserPage
  );

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  /*
    Get unread notifications
  */
  useEffect(() => {
    const getNotifications = async () => {
      if (!isLoggedIn) {
        setNotificationCount(0);
        return;
      }

      try {
        const response = await axiosInstance.get(
          "/user-notifications/"
        );

        const notifications =
          response.data.notifications ||
          response.data ||
          [];

        const unreadCount = notifications.filter(
          (notification) => !notification.isRead
        ).length;

        setNotificationCount(unreadCount);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("loginToken");
          localStorage.removeItem("role");
          localStorage.removeItem("userInfo");

          toast.error("Session expired. Please login again.");

          navigate("/login");
        }
      }
    };

    getNotifications();
  }, [isLoggedIn, navigate]);

  /*
    Logout
  */
  const handleLogout = () => {
    localStorage.removeItem("loginToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userInfo");

    setMobileMenuOpen(false);
    setNotificationCount(0);

    toast.success("Logged out successfully");

    navigate("/login");
  };

  /*
    Theme toggle
  */
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  /*
    Public navigation
  */
  const publicNavLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "How It Works",
      path: "/#how-it-works",
    },
    {
      name: "Features",
      path: "/#features",
    },
    {
      name: "Trust",
      path: "/#trust",
    },
  ];

  /*
    Logged-in user navigation
  */
  const userNavLinks = [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Report Crime",
      path: "/user/report",
      icon: FilePlus,
    },
    {
      name: "My Cases",
      path: "/user/cases",
      icon: FolderOpen,
    },
    {
      name: "Notifications",
      path: "/user/notifications",
      icon: Bell,
    },
  ];

  /*
    ============================================================
    LOGGED-IN USER TOP NAVBAR
    ============================================================
  */

  if (isLoggedIn) {
    return (
      <div className="w-full bg-slate-50">

        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">

          {/* Centered Navbar Container */}
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* Logo */}
            <Link
              to="/user/dashboard"
              onClick={closeMobileMenu}
              className="flex shrink-0 items-center gap-3"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <ShieldCheck size={22} />
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  INCIDEX
                </h1>

                <p className="hidden text-xs text-slate-500 sm:block">
                  Report. Track. Resolve.
                </p>
              </div>

            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 lg:flex">

              {userNavLinks.map((link) => {
                const Icon = link.icon;

                const isActive =
                  location.pathname === link.path ||
                  (
                    link.path === "/user/cases" &&
                    location.pathname.startsWith("/user/cases/")
                  );

                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={`
                      flex items-center gap-2 rounded-xl
                      px-3 py-2.5 text-sm font-medium
                      transition
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                    `}
                  >

                    <Icon
                      size={18}
                      className={
                        isActive
                          ? "text-blue-600"
                          : "text-slate-500"
                      }
                    />

                    <span>
                      {link.name}
                    </span>

                    {/* Notification Count */}
                    {link.name === "Notifications" &&
                      notificationCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                          {notificationCount > 99
                            ? "99+"
                            : notificationCount}
                        </span>
                      )}

                  </NavLink>
                );
              })}

            </div>

            {/* Desktop Right Section */}
            <div className="hidden items-center gap-2 lg:flex">

              {/* Theme */}
              <button
                type="button"
                onClick={toggleDarkMode}
                className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                title="Toggle theme"
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <Sun size={19} />
                ) : (
                  <Moon size={19} />
                )}
              </button>

              {/* Profile */}
              <Link
                to="/user/profile"
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-50"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                  {user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : "U"}
                </div>

                <div className="hidden xl:block">
                  <p className="max-w-28 truncate text-xs font-semibold text-slate-900">
                    {user?.name || "User"}
                  </p>

                  <p className="text-[11px] text-slate-500">
                    Profile
                  </p>
                </div>

              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg p-2 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={19} />
              </button>

            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>

          </div>

          {/* Mobile Logged-in Menu */}
          {mobileMenuOpen && (
            <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">

              {/* User Information */}
              <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                  {user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : "U"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user?.name || "User"}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {user?.email || "User account"}
                  </p>
                </div>

              </div>

              {/* Mobile Navigation */}
              <div className="space-y-1">

                {userNavLinks.map((link) => {
                  const Icon = link.icon;

                  const isActive =
                    location.pathname === link.path ||
                    (
                      link.path === "/user/cases" &&
                      location.pathname.startsWith("/user/cases/")
                    );

                  return (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={closeMobileMenu}
                      className={`
                        flex items-center gap-3 rounded-xl
                        px-3 py-3 text-sm font-medium
                        transition
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }
                      `}
                    >

                      <Icon
                        size={19}
                        className={
                          isActive
                            ? "text-blue-600"
                            : "text-slate-500"
                        }
                      />

                      <span className="flex-1">
                        {link.name}
                      </span>

                      {/* Notification Count */}
                      {link.name === "Notifications" &&
                        notificationCount > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                            {notificationCount > 99
                              ? "99+"
                              : notificationCount}
                          </span>
                        )}

                    </NavLink>
                  );
                })}

                {/* Profile */}
                <NavLink
                  to="/user/profile"
                  onClick={closeMobileMenu}
                  className={({ isActive }) => `
                    flex items-center gap-3 rounded-xl
                    px-3 py-3 text-sm font-medium
                    transition
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                  `}
                >

                  <User
                    size={19}
                    className="text-slate-500"
                  />

                  <span>
                    Profile
                  </span>

                </NavLink>

              </div>

              {/* Mobile Actions */}
              <div className="mt-3 border-t border-slate-200 pt-3">

                {/* Theme */}
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >

                  {darkMode ? (
                    <Sun size={19} />
                  ) : (
                    <Moon size={19} />
                  )}

                  <span>
                    {darkMode
                      ? "Light Mode"
                      : "Dark Mode"}
                  </span>

                </button>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >

                  <LogOut size={19} />

                  <span>
                    Logout
                  </span>

                </button>

              </div>

            </div>
          )}

        </nav>

      </div>
    );
  }

  /*
    ============================================================
    PUBLIC TOP NAVBAR
    ============================================================
  */

  return (
    <div className="w-full bg-slate-50">

      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">

        {/* Centered Navbar Container */}
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                INCIDEX
              </h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                Report. Track. Resolve.
              </p>
            </div>

          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 md:flex">

            {publicNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={closeMobileMenu}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                {link.name}
              </Link>
            ))}

          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">

            {/* Theme */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>

            {/* Login */}
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Login
            </Link>

            {/* Register */}
            <Link
              to="/register"
              onClick={closeMobileMenu}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Register
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
            className="rounded-lg p-2 text-slate-700 md:hidden"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

        </div>

        {/* Mobile Public Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-5 md:hidden">

            <div className="flex flex-col gap-2">

              {publicNavLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {link.name}
                </Link>
              ))}

              <div className="mt-3 border-t border-slate-200 pt-3">

                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="mt-2 block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Register
                </Link>

              </div>

            </div>

          </div>
        )}

      </nav>

    </div>
  );
};

export default Navbar;

