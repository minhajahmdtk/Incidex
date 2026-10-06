import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  Bell,
  MessageSquare,
  LogOut,
  AlertCircle,
  Clock,
  CheckCircle,
  Shield,
  ArrowRight,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { toast } from "sonner";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalCases: 0,
    casesByStatus: {
      new: 0,
      acknowledged: 0,
      inProgress: 0,
      resolved: 0,
    },
  });

  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const [error, setError] = useState("");

  // Get dashboard data
  const getDashboardData = () => {
    axios
      .get("http://localhost:3000/admin/dashboard", {
        headers: {
          token: localStorage.getItem("loginToken"),
        },
      })
      .then((response) => {
        setDashboardData({
          totalUsers: response.data.totalUsers || 0,
          totalCases: response.data.totalCases || 0,
          casesByStatus: {
            new: response.data.casesByStatus?.new || 0,
            acknowledged:
              response.data.casesByStatus?.acknowledged || 0,
            inProgress:
              response.data.casesByStatus?.inProgress || 0,
            resolved:
              response.data.casesByStatus?.resolved || 0,
          },
        });

        setError("");
      })
      .catch((error) => {
        const message =
          error.response?.data?.message ||
          "Failed to load dashboard data";

        setError(message);
        toast.error(message);
      });
  };

  // Get category data
  const getCategoryData = () => {
    axios
      .get("http://localhost:3000/admin/dashboard/category", {
        headers: {
          token: localStorage.getItem("loginToken"),
        },
      })
      .then((response) => {
        setCategoryData(response.data.categoryData || []);
      })
      .catch((error) => {
        const message =
          error.response?.data?.message ||
          "Failed to load category data";

        toast.error(message);
      });
  };

  // Get monthly data
  const getMonthlyData = () => {
    axios
      .get("http://localhost:3000/admin/dashboard/monthly", {
        headers: {
          token: localStorage.getItem("loginToken"),
        },
      })
      .then((response) => {
        setMonthlyData(response.data.monthlyData || []);
      })
      .catch((error) => {
        const message =
          error.response?.data?.message ||
          "Failed to load monthly data";

        toast.error(message);
      });
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("loginToken");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("userInfo");

    toast.success("Logged out successfully");

    navigate("/admin/login");
  };

  // Load dashboard data
  useEffect(() => {
    getDashboardData();
    getCategoryData();
    getMonthlyData();
  }, []);

  // Pie chart data
  const categoryChartData = categoryData.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  // Line chart data
  const monthlyChartData = monthlyData.map((item) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return {
      month: monthNames[item._id.month - 1],
      cases: item.count,
    };
  });

  // Chart colors
  const chartColors = [
    "#2563EB",
    "#16A34A",
    "#D97706",
    "#DC2626",
    "#7C3AED",
    "#0891B2",
    "#EA580C",
    "#475569",
  ];

  // Statistics cards
  const statCards = [
    {
      title: "Total Users",
      value: dashboardData.totalUsers,
      icon: Users,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Cases",
      value: dashboardData.totalCases,
      icon: FileText,
      iconClass: "bg-slate-100 text-slate-600",
    },
    {
      title: "New Cases",
      value: dashboardData.casesByStatus.new,
      icon: AlertCircle,
      iconClass: "bg-amber-100 text-amber-600",
    },
    {
      title: "Acknowledged",
      value: dashboardData.casesByStatus.acknowledged,
      icon: Clock,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "In Progress",
      value: dashboardData.casesByStatus.inProgress,
      icon: Clock,
      iconClass: "bg-orange-100 text-orange-600",
    },
    {
      title: "Resolved",
      value: dashboardData.casesByStatus.resolved,
      icon: CheckCircle,
      iconClass: "bg-emerald-100 text-emerald-600",
    },
  ];

  // Management cards
  const managementCards = [
    {
      title: "Users",
      description: "View and manage registered users",
      path: "/admin/users",
      icon: Users,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "Cases",
      description: "View and manage crime cases",
      path: "/admin/cases",
      icon: FileText,
      iconClass: "bg-slate-100 text-slate-600",
    },
    {
      title: "Feedback",
      description: "View feedback submitted by users",
      path: "/admin/feedback",
      icon: MessageSquare,
      iconClass: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Shield size={21} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                INCIDEX
              </h1>

              <p className="text-xs text-slate-500">
                Crime Incident Reporting System
              </p>
            </div>

          </div>

          {/* Top actions */}
          <div className="flex items-center gap-3">

            {/* Notifications */}
            <Link
              to="/admin/notifications"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <Bell size={17} />
              Notifications
            </Link>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={17} />
              Logout
            </button>

          </div>

        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Heading */}
        <div className="mb-8">

          <h2 className="text-2xl font-bold text-slate-900">
            Administrator Dashboard
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monitor and manage crime incident reports.
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {card.value}
                    </p>

                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg ${card.iconClass}`}
                  >
                    <Icon size={21} />
                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* Charts */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Crime Category Pie Chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-4">

              <h3 className="text-lg font-semibold text-slate-900">
                Crime Categories
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Distribution of reported cases by crime category.
              </p>

            </div>

            {categoryChartData.length === 0 ? (

              <div className="flex h-80 items-center justify-center">
                <p className="text-sm text-slate-500">
                  No category data available.
                </p>
              </div>

            ) : (

              <div className="h-80">

                <ResponsiveContainer width="100%" height="100%">

                  <PieChart>

                    <Pie
                      data={categoryChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={95}
                      label={({ name, value }) =>
                        `${name}: ${value}`
                      }
                    >

                      {categoryChartData.map((entry, index) => (
                        <Cell
                          key={`category-${index}`}
                          fill={
                            chartColors[
                              index % chartColors.length
                            ]
                          }
                        />
                      ))}

                    </Pie>

                    <Tooltip />

                    <Legend
                      verticalAlign="bottom"
                      height={40}
                    />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            )}

          </div>

          {/* Monthly Line Chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-4">

              <h3 className="text-lg font-semibold text-slate-900">
                Monthly Case Reports
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Number of cases reported each month.
              </p>

            </div>

            {monthlyChartData.length === 0 ? (

              <div className="flex h-80 items-center justify-center">
                <p className="text-sm text-slate-500">
                  No monthly data available.
                </p>
              </div>

            ) : (

              <div className="h-80">

                <ResponsiveContainer width="100%" height="100%">

                  <LineChart
                    data={monthlyChartData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 0,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey="month"
                      label={{
                        value: "Months",
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                      label={{
                        value: "Number of Cases",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="cases"
                      name="Cases"
                      stroke="#2563EB"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                      }}
                      activeDot={{
                        r: 7,
                      }}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            )}

          </div>

        </div>

        {/* Management */}
        <div className="mt-8">

          <div className="mb-5">

            <h3 className="text-lg font-semibold text-slate-900">
              Management
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Select an option to manage the INCIDEX system.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {managementCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  to={card.path}
                  className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                >

                  <div className="flex items-start justify-between">

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-lg ${card.iconClass}`}
                    >
                      <Icon size={21} />
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                    />

                  </div>

                  <h4 className="mt-4 text-base font-semibold text-slate-900">
                    {card.title}
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    {card.description}
                  </p>

                </Link>
              );
            })}

          </div>

        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;