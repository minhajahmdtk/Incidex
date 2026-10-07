import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Bell,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

import { toast } from "sonner";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // ==================================================
  // DARK / LIGHT THEME
  // ==================================================

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

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem("loginToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userInfo");

    toast.success("Logged out successfully");

    navigate("/admin/login");
  };

  // ==================================================
  // NOTIFICATION ACTIVE STATE
  // ==================================================

  const isNotificationPage =
    location.pathname === "/admin/notifications";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-navbar transition-colors duration-300">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ==================================================
            INCIDEX BRAND
        ================================================== */}

        <Link
          to="/admin/dashboard"
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
                text-xl
                font-bold
                tracking-tight
                text-transparent
              "
            >
              INCIDEX
            </h1>

            <p className="mt-1 text-[11px] font-medium tracking-wide text-muted-foreground">
              Report. Track. Resolve.
            </p>
          </div>
        </Link>

        {/* ==================================================
            ADMIN ACTIONS
        ================================================== */}

        <div className="flex items-center gap-1">

          {/* ==================================================
              NOTIFICATIONS
          ================================================== */}

          <Link
            to="/admin/notifications"
            aria-label="Notifications"
            title="Notifications"
            className={`
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              transition-colors
              duration-200
              ${
                isNotificationPage
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            `}
          >
            <Bell
              size={19}
              strokeWidth={1.9}
            />
          </Link>

          {/* ==================================================
              THEME TOGGLE
          ================================================== */}

          <button
            type="button"
            onClick={() => setDarkMode((previous) => !previous)}
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              darkMode
                ? "Light mode"
                : "Dark mode"
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              text-muted-foreground
              transition-colors
              duration-200
              hover:bg-muted
              hover:text-foreground
            "
          >
            {darkMode ? (
              <Sun
                size={19}
                strokeWidth={1.9}
              />
            ) : (
              <Moon
                size={19}
                strokeWidth={1.9}
              />
            )}
          </button>

          {/* ==================================================
              LOGOUT
          ================================================== */}

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              text-[#B94A48]
              transition-colors
              duration-200
              hover:bg-[#B94A48]/10
              dark:text-[#D76562]
              dark:hover:bg-[#D76562]/10
            "
          >
            <LogOut
              size={19}
              strokeWidth={1.9}
            />
          </button>

        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;