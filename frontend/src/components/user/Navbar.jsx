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

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const token = localStorage.getItem("loginToken");
  const role = localStorage.getItem("role");
  const user = getStoredUser();

  const isUserPage = location.pathname.startsWith("/user");

  const isLoggedIn = Boolean(
    token &&
      role === "user" &&
      isUserPage
  );

  /* ============================================================
     THEME
     ============================================================ */

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* ============================================================
     CLOSE MOBILE MENU
     ============================================================ */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  /* ============================================================
     GET UNREAD NOTIFICATIONS
     ============================================================ */

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

          toast.error(
            "Session expired. Please login again."
          );

          navigate("/login");
        }
      }
    };

    getNotifications();
  }, [isLoggedIn, navigate]);

  /* ============================================================
     LOGOUT
     ============================================================ */

  const handleLogout = () => {
    localStorage.removeItem("loginToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userInfo");

    setMobileMenuOpen(false);
    setNotificationCount(0);

    toast.success("Logged out successfully");

    navigate("/home");
  };

  /* ============================================================
     THEME TOGGLE
     ============================================================ */

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  /* ============================================================
     PUBLIC NAVIGATION
     ============================================================ */

  const publicNavLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "How It Works",
      path: "#how-it-works",
    },
    {
      name: "Features",
      path: "#features",
    },
    {
      name: "Trust",
      path: "#trust",
    },
  ];

  /* ============================================================
     USER NAVIGATION
     ============================================================ */

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

  /* ============================================================
     LOGGED-IN USER NAVBAR
     ============================================================ */

  if (isLoggedIn) {
    return (
      <div
        className="
          w-full
          bg-background
          text-foreground
          transition-colors
          duration-300
        "
      >
        <nav
          className="
            sticky
            top-0
            z-50
            border-b
            border-border
            bg-background/95
            backdrop-blur-xl
            transition-colors
            duration-300
          "
        >
          {/* Main Navbar */}

          <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* Logo */}

            <Link
              to="/user/dashboard"
              onClick={closeMobileMenu}
              className="flex shrink-0 items-center gap-3"
            >
              <img
                src="/Crime.png"
                alt="INCIDEX"
                className="h-10 w-10 object-contain"
              />

              <div>
                <h1
                  className="
                    bg-gradient-to-r
                    from-[#B94A48]
                    via-[#7FAF8A]
                    to-[#555C64]
                    bg-clip-text
                    text-lg
                    font-bold
                    tracking-tight
                    text-transparent
                  "
                >
                  INCIDEX
                </h1>

                <p className="hidden text-xs text-muted-foreground sm:block">
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
                    location.pathname.startsWith(
                      "/user/cases/"
                    )
                  );

                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={`
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      transition-all
                      duration-200
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-[#B94A48]/10 hover:text-[#B94A48]"
                      }
                    `}
                  >
                    <Icon size={18} />

                    <span>{link.name}</span>

                    {link.name === "Notifications" &&
                      notificationCount > 0 && (
                        <span
                          className="
                            flex
                            h-5
                            min-w-5
                            items-center
                            justify-center
                            rounded-full
                            bg-destructive
                            px-1.5
                            text-[11px]
                            font-bold
                            text-white
                          "
                        >
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

              {/* Theme Toggle */}

              <button
                type="button"
                onClick={toggleDarkMode}
                className="
                  rounded-lg
                  p-2
                  text-muted-foreground
                  transition-all
                  duration-200
                  hover:bg-[#B94A48]/10
                  hover:text-[#B94A48]
                "
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
                className="
                  flex
                  items-center
                  justify-center
                  rounded-lg
                  p-1.5
                  text-foreground
                  transition-all
                  duration-200
                "
                aria-label="Profile"
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-primary
                    font-semibold
                    text-primary-foreground
                    transition-all
                    duration-200
                  "
                >
                  {user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
              </Link>

              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  rounded-lg
                  p-2
                  text-muted-foreground
                  transition-all
                  duration-200
                  hover:bg-[#B94A48]/10
                  hover:text-[#B94A48]
                "
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
              className="
                rounded-lg
                p-2
                text-foreground
                transition-all
                duration-200
                hover:bg-[#B94A48]/10
                hover:text-[#B94A48]
                lg:hidden
              "
              aria-label="Open menu"
            >
              {mobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>

          </div>

          {/* Mobile User Menu */}

          {mobileMenuOpen && (
            <div
              className="
                border-t
                border-border
                bg-background
                px-4
                py-4
                lg:hidden
              "
            >

              {/* User Information */}

              <div
                className="
                  mb-3
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  bg-secondary
                  p-3
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-primary
                    font-semibold
                    text-primary-foreground
                  "
                >
                  {user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : "U"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user?.name || "User"}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
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
                      location.pathname.startsWith(
                        "/user/cases/"
                      )
                    );

                  return (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={closeMobileMenu}
                      className={`
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-sm
                        font-medium
                        transition-all
                        duration-200
                        ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-[#B94A48]/10 hover:text-[#B94A48]"
                        }
                      `}
                    >
                      <Icon size={19} />

                      <span className="flex-1">
                        {link.name}
                      </span>

                      {link.name === "Notifications" &&
                        notificationCount > 0 && (
                          <span
                            className="
                              flex
                              h-5
                              min-w-5
                              items-center
                              justify-center
                              rounded-full
                              bg-destructive
                              px-1.5
                              text-[11px]
                              font-bold
                              text-white
                            "
                          >
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
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    font-medium
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-[#B94A48]/10 hover:text-[#B94A48]"
                    }
                  `}
                >
                  <User size={19} />

                  <span>Profile</span>
                </NavLink>

              </div>

              {/* Mobile Actions */}

              <div
                className="
                  mt-3
                  border-t
                  border-border
                  pt-3
                "
              >

                {/* Theme */}

                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    font-medium
                    text-muted-foreground
                    transition-all
                    duration-200
                    hover:bg-[#B94A48]/10
                    hover:text-[#B94A48]
                  "
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
                  className="
                    mt-1
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    font-medium
                    text-muted-foreground
                    transition-all
                    duration-200
                    hover:bg-[#B94A48]/10
                    hover:text-[#B94A48]
                  "
                >
                  <LogOut size={19} />

                  <span>Logout</span>
                </button>

              </div>

            </div>
          )}

        </nav>
      </div>
    );
  }

  /* ============================================================
     PUBLIC NAVBAR
     ============================================================ */

  return (
    <div
      className="
        w-full
        bg-background
        text-foreground
        transition-colors
        duration-300
      "
    >
      <nav
        className="
          sticky
          top-0
          z-50
          border-b
          border-border
          bg-background/95
          backdrop-blur-xl
          transition-colors
          duration-300
        "
      >

        {/* Main Navbar */}

        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3"
          >
            <img
              src="/Crime.png"
              alt="INCIDEX"
              className="h-10 w-10 object-contain"
            />

            <div>
              <h1
                className="
                  bg-gradient-to-r
                  from-[#B94A48]
                  via-[#7FAF8A]
                  to-[#555C64]
                  bg-clip-text
                  text-lg
                  font-bold
                  tracking-tight
                  text-transparent
                "
              >
                INCIDEX
              </h1>

              <p className="hidden text-xs text-muted-foreground sm:block">
                Report. Track. Resolve.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}

          <div className="hidden items-center gap-7 md:flex">

            {publicNavLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={closeMobileMenu}
                className="
                  text-sm
                  font-medium
                  text-muted-foreground
                  transition-all
                  duration-200
                  hover:text-[#B94A48]
                "
              >
                {link.name}
              </a>
            ))}

          </div>

          {/* Desktop Actions */}

          <div className="hidden items-center gap-3 md:flex">

            {/* Theme */}

            <button
              type="button"
              onClick={toggleDarkMode}
              className="
                rounded-lg
                p-2
                text-muted-foreground
                transition-all
                duration-200
                hover:bg-[#B94A48]/10
                hover:text-[#B94A48]
              "
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
              className="
                rounded-lg
                px-4
                py-2
                text-sm
                font-semibold
                text-muted-foreground
                transition-all
                duration-200
                hover:bg-[#B94A48]/10
                hover:text-[#B94A48]
              "
            >
              Login
            </Link>

            {/* Register */}

            <Link
              to="/register"
              onClick={closeMobileMenu}
              className="
                rounded-lg
                bg-primary
                px-5
                py-2.5
                text-sm
                font-semibold
                text-primary-foreground
                shadow-sm
                transition-all
                duration-200
                hover:bg-[#B94A48]
                hover:text-white
              "
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
            className="
              rounded-lg
              p-2
              text-foreground
              transition-all
              duration-200
              hover:bg-[#B94A48]/10
              hover:text-[#B94A48]
              md:hidden
            "
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
          <div
            className="
              border-t
              border-border
              bg-background
              px-4
              py-5
              md:hidden
            "
          >

            <div className="flex flex-col gap-2">

              {publicNavLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={closeMobileMenu}
                  className="
                    rounded-lg
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-muted-foreground
                    transition-all
                    duration-200
                    hover:bg-[#B94A48]/10
                    hover:text-[#B94A48]
                  "
                >
                  {link.name}
                </a>
              ))}

              <div
                className="
                  mt-3
                  border-t
                  border-border
                  pt-3
                "
              >

                {/* Theme */}

                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-muted-foreground
                    transition-all
                    duration-200
                    hover:bg-[#B94A48]/10
                    hover:text-[#B94A48]
                  "
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

                {/* Login */}

                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="
                    mt-1
                    block
                    rounded-lg
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-muted-foreground
                    transition-all
                    duration-200
                    hover:bg-[#B94A48]/10
                    hover:text-[#B94A48]
                  "
                >
                  Login
                </Link>

                {/* Register */}

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="
                    mt-2
                    block
                    rounded-lg
                    bg-primary
                    px-4
                    py-3
                    text-center
                    text-sm
                    font-semibold
                    text-primary-foreground
                    transition-all
                    duration-200
                    hover:bg-[#B94A48]
                    hover:text-white
                  "
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