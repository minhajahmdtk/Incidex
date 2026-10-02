import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import axiosInstance from "../../axiosInterceptor";

/*
  API:
  GET /user-notifications

  This endpoint is used only when a logged-in user is viewing
  the authenticated navigation.
*/

export function getStoredUser() {
  try {
    const user = localStorage.getItem("userInfo");

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function handleUnauthorized(navigate) {
  localStorage.removeItem("loginToken");
  localStorage.removeItem("role");
  localStorage.removeItem("userInfo");

  toast.error("Session expired. Please log in again.");

  navigate("/login");
}

export function Logo() {
  return (
    <Link
      to="/"
      className="group flex items-center gap-3"
      aria-label="INCIDEX Home"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172033] text-lg font-bold text-white shadow-sm transition-transform group-hover:scale-105">
        I
      </div>

      <div className="hidden sm:block">
        <p className="text-lg font-bold tracking-tight text-[#172033]">
          INCIDEX
        </p>

        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
          Incident Reporting
        </p>
      </div>
    </Link>
  );
}

export function PageHeader({
  title,
  description,
  action,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);

    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((value) => !value)}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}

function PublicNavLink({ href, children }) {
  return (
    <a
      href={href}
      className="text-sm font-medium text-slate-600 transition hover:text-[#172033]"
    >
      {children}
    </a>
  );
}

export default function Navbar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const token = localStorage.getItem("loginToken");
  const role = localStorage.getItem("role");
  const user = getStoredUser();

  const isLoggedIn = Boolean(token && role === "user");

  const isHome = location.pathname === "/";

  useEffect(() => {
    if (!isLoggedIn) {
      setNotificationCount(0);
      return;
    }

    let active = true;

    const loadNotifications = async () => {
      try {
        const response = await axiosInstance.get("/user-notifications");

        const notifications =
          response.data?.notifications || [];

        const unread = notifications.filter(
          (notification) => !notification.isRead
        ).length;

        if (active) {
          setNotificationCount(unread);
        }
      } catch (error) {
        if (error?.response?.status === 401 && active) {
          handleUnauthorized(navigate);
        }
      }
    };

    loadNotifications();

    return () => {
      active = false;
    };
  }, [isLoggedIn, navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("loginToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userInfo");

    setLogoutOpen(false);

    toast.success("You have been logged out.");

    navigate("/login");
  };

  const displayName =
    user?.name ||
    user?.fullName ||
    "User";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  /*
    Public navbar
  */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Logo />

            <nav className="hidden items-center gap-8 md:flex">
              <PublicNavLink href={isHome ? "#home" : "/#home"}>
                Home
              </PublicNavLink>

              <PublicNavLink
                href={isHome ? "#how-it-works" : "/#how-it-works"}
              >
                How It Works
              </PublicNavLink>

              <PublicNavLink
                href={isHome ? "#features" : "/#features"}
              >
                Features
              </PublicNavLink>

              <PublicNavLink
                href={isHome ? "#trust" : "/#trust"}
              >
                Trust
              </PublicNavLink>
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <ThemeToggle />

              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-[#172033] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#25314a]"
              >
                Register
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />

              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700"
                    aria-label="Open navigation"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-[300px] bg-white"
                >
                  <SheetHeader>
                    <SheetTitle className="text-left">
                      <Logo />
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-8 flex flex-col gap-2">
                    <a
                      href={isHome ? "#home" : "/#home"}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Home
                    </a>

                    <a
                      href={isHome ? "#how-it-works" : "/#how-it-works"}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      How It Works
                    </a>

                    <a
                      href={isHome ? "#features" : "/#features"}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Features
                    </a>

                    <a
                      href={isHome ? "#trust" : "/#trust"}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Trust
                    </a>

                    <div className="my-3 h-px bg-slate-200" />

                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg bg-[#172033] px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                      Create Account
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        {children}
      </div>
    );
  }

  /*
    Authenticated user navigation
  */
  const sidebarLinks = [
    {
      label: "Dashboard",
      path: "/user/dashboard",
      icon: ShieldCheck,
    },
    {
      label: "Report Crime",
      path: "/user/report",
      icon: ShieldCheck,
    },
    {
      label: "My Cases",
      path: "/user/cases",
      icon: ShieldCheck,
    },
    {
      label: "Crime History",
      path: "/user/history",
      icon: ShieldCheck,
    },
    {
      label: "Notifications",
      path: "/user/notifications",
      icon: Bell,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-[#172033] lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-white/10 px-5">
          <Link to="/user/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-[#172033]">
              I
            </div>

            <div>
              <p className="font-bold text-white">INCIDEX</p>
              <p className="text-[9px] uppercase tracking-wider text-slate-400">
                User Portal
              </p>
            </div>
          </Link>
        </div>

        <div className="flex-1 px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Main Menu
          </p>

          <nav className="space-y-1">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-[#172033]"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />

                  <span>{item.label}</span>

                  {item.label === "Notifications" &&
                    notificationCount > 0 && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                        {notificationCount > 9
                          ? "9+"
                          : notificationCount}
                      </span>
                    )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 p-3">
          <Link
            to="/user/profile"
            className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <User className="h-4 w-4" />

            <span className="text-sm font-medium">
              Profile
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3 lg:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200"
                    aria-label="Open navigation"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="w-[280px] bg-[#172033] p-0 text-white"
                >
                  <SheetHeader className="border-b border-white/10 px-5 py-4">
                    <SheetTitle className="text-left text-white">
                      INCIDEX
                    </SheetTitle>
                  </SheetHeader>

                  <nav className="space-y-1 px-3 py-6">
                    {sidebarLinks.map((item) => {
                      const Icon = item.icon;

                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${
                              isActive
                                ? "bg-white text-[#172033]"
                                : "text-slate-300 hover:bg-white/10 hover:text-white"
                            }`
                          }
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </NavLink>
                      );
                    })}

                    <NavLink
                      to="/user/profile"
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${
                          isActive
                            ? "bg-white text-[#172033]"
                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`
                      }
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </NavLink>
                  </nav>
                </SheetContent>
              </Sheet>

              <Link
                to="/user/dashboard"
                className="font-bold text-[#172033]"
              >
                INCIDEX
              </Link>
            </div>

            <div className="hidden lg:block">
              <p className="text-sm font-medium text-slate-500">
                Crime Incident Reporting System
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />

              <Link
                to="/user/notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />

                {notificationCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                    {notificationCount > 9
                      ? "9+"
                      : notificationCount}
                  </span>
                )}
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-[#172033] text-xs font-semibold text-white">
                        {initials || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="hidden text-left sm:block">
                      <p className="max-w-32 truncate text-sm font-semibold text-slate-800">
                        {displayName}
                      </p>

                      <p className="text-[11px] text-slate-500">
                        User
                      </p>
                    </div>

                    <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/user/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => setLogoutOpen(true)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Logout from INCIDEX?
            </AlertDialogTitle>

            <AlertDialogDescription>
              You will need to log in again to access your
              account and reported cases.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}