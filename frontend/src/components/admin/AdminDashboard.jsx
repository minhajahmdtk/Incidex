
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

import {
  Users,
  FileText,
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  IndianRupee,
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
  Sector,
} from "recharts";

import { toast } from "sonner";
import axios from "axios";

const AdminDashboard = () => {
  // DASHBOARD STATE

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalCases: 0,
    totalFakeCases: 0,
    moneyReceived: 0,
    casesByStatus: {
      new: 0,
      acknowledged: 0,
      inProgress: 0,
      resolved: 0,
    },
  });

  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [activePieIndex, setActivePieIndex] = useState(-1);
  const [error, setError] = useState("");

  // GET DASHBOARD DATA

  const getDashboardData = () => {
    axios
      .get("http://localhost:3000/admin/dashboard", {
        headers: {
          token: localStorage.getItem("loginToken"),
        },
      })
      .then((response) => {
        setDashboardData((previousData) => ({
          ...previousData,
          totalUsers: Number(response.data.totalUsers) || 0,
          totalCases: Number(response.data.totalCases) || 0,
          casesByStatus: {
            new: Number(response.data.casesByStatus?.new) || 0,
            acknowledged:
              Number(response.data.casesByStatus?.acknowledged) || 0,
            inProgress:
              Number(response.data.casesByStatus?.inProgress) || 0,
            resolved:
              Number(response.data.casesByStatus?.resolved) || 0,
          },
        }));

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

  // GET CATEGORY DATA

  const getCategoryData = () => {
    axios
      .get("http://localhost:3000/admin/dashboard/category", {
        headers: {
          token: localStorage.getItem("loginToken"),
        },
      })
      .then((response) => {
        const data = response.data.categoryData;
        setCategoryData(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ||
            "Failed to load category data"
        );
      });
  };

  // GET MONTHLY DATA

  const getMonthlyData = () => {
    axios
      .get("http://localhost:3000/admin/dashboard/monthly", {
        headers: {
          token: localStorage.getItem("loginToken"),
        },
      })
      .then((response) => {
        const data = response.data.monthlyData;
        setMonthlyData(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ||
            "Failed to load monthly data"
        );
      });
  };

  // GET FAKE CASES AND MONEY RECEIVED

  const getFakeAndMoneyData = () => {
    axios
      .get("http://localhost:3000/admin/cases", {
        headers: {
          token: localStorage.getItem("loginToken"),
        },
      })
      .then((response) => {
        const cases = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.cases)
            ? response.data.cases
            : [];

        const totalFakeCases = cases.filter(
          (crimeCase) => crimeCase.isFakeReport === true
        ).length;

        const moneyReceived = cases.reduce((total, crimeCase) => {
          if (crimeCase.fineStatus === "Paid") {
            return total + (Number(crimeCase.fineAmount) || 0);
          }

          return total;
        }, 0);

        setDashboardData((previousData) => ({
          ...previousData,
          totalFakeCases,
          moneyReceived,
        }));
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ||
            "Failed to load fake case and payment data"
        );
      });
  };

  // LOAD DATA

  useEffect(() => {
    getDashboardData();
    getCategoryData();
    getMonthlyData();
    getFakeAndMoneyData();
  }, []);

  // CATEGORY CHART DATA

  const categoryChartData = categoryData.map((item) => ({
    name: item._id,
    value: Number(item.count) || 0,
  }));

  // MONTHLY CHART DATA
  // SHOW ALL 12 MONTHS

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const monthlyCounts = new Map();

  monthlyData.forEach((item) => {
    const month = Number(item._id?.month);
    const count = Number(item.count) || 0;

    if (Number.isInteger(month) && month >= 1 && month <= 12) {
      monthlyCounts.set(
        month,
        (monthlyCounts.get(month) || 0) + count
      );
    }
  });

  const monthlyChartData = monthNames.map((month, index) => ({
    month,
    cases: monthlyCounts.get(index + 1) || 0,
  }));

  const monthlyTotal = monthlyChartData.reduce(
    (total, item) => total + item.cases,
    0
  );

  // CHART COLORS

  const chartColors = [
    "#6366F1",
    "#F59E0B",
    "#0EA5E9",
    "#A855F7",
    "#64748B",
    "#06B6D4",
    "#D97706",
    "#8B5CF6",
  ];

  // ACTIVE PIE SHAPE

  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          cornerRadius={6}
        />

        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 3}
          outerRadius={innerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.35}
        />
      </g>
    );
  };

  // EIGHT STATISTIC CARDS

  const statCards = [
    {
      title: "Total Users",
      value: dashboardData.totalUsers,
      icon: Users,
      iconClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Total Cases",
      value: dashboardData.totalCases,
      icon: FileText,
      iconClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    },
    {
      title: "New Cases",
      value: dashboardData.casesByStatus.new,
      icon: AlertCircle,
      iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Acknowledged",
      value: dashboardData.casesByStatus.acknowledged,
      icon: Clock,
      iconClass: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
    {
      title: "In Progress",
      value: dashboardData.casesByStatus.inProgress,
      icon: Clock,
      iconClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    },
    {
      title: "Resolved",
      value: dashboardData.casesByStatus.resolved,
      icon: CheckCircle,
      iconClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    },
    {
      title: "Total Fake Cases",
      value: dashboardData.totalFakeCases,
      icon: ShieldAlert,
      iconClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
    {
      title: "Money Received",
      value: `₹${Number(
        dashboardData.moneyReceived || 0
      ).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}`,
      icon: IndianRupee,
      iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
  ];

  // MANAGEMENT CARDS

  const managementCards = [
    {
      title: "Users",
      description: "View and manage registered users",
      path: "/admin/users",
      icon: Users,
      iconClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Cases",
      description: "View and manage crime cases",
      path: "/admin/cases",
      icon: FileText,
      iconClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    },
    {
      title: "Feedback",
      description: "View feedback submitted by users",
      path: "/admin/feedback",
      icon: MessageSquare,
      iconClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* PAGE TITLE */}

        <div className="mb-8">
          <h2 className="bg-gradient-to-r from-[#B94A48] via-[#7FAF8A] to-[#555C64] bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            Administrator Dashboard
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor and manage crime incident reports.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-[#B94A48]/30 bg-[#B94A48]/5 p-4 dark:bg-[#D76562]/5">
            <p className="text-sm text-[#B94A48] dark:text-[#D76562]">
              {error}
            </p>
          </div>
        )}

        {/* ORGANIZED EIGHT STATISTIC CARDS */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="
                  group relative overflow-hidden rounded-2xl
                  border border-border bg-white p-5
                  transition-all duration-300
                  hover:-translate-y-1 hover:border-muted-foreground/30
                  dark:bg-[#252A32]
                "
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>

                    <p className="mt-2 break-words text-2xl font-bold tracking-tight text-foreground">
                      {card.value}
                    </p>
                  </div>

                  <div
                    className={`
                      flex h-12 w-12 shrink-0 items-center justify-center
                      rounded-xl ${card.iconClass}
                      transition-transform duration-300
                      group-hover:scale-105
                    `}
                  >
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CHARTS */}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* CRIME CATEGORY PIE CHART */}

          <div className="rounded-2xl border border-border bg-white p-6 dark:bg-[#252A32]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Crime Categories
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Distribution of reported cases by crime category.
              </p>
            </div>

            {categoryChartData.length === 0 ? (
              <div className="flex h-80 items-center justify-center">
                <p className="text-sm text-muted-foreground">
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
                      innerRadius={48}
                      outerRadius={100}
                      paddingAngle={3}
                      cornerRadius={6}
                      label={({ name, value }) => `${name}: ${value}`}
                      isAnimationActive
                      animationBegin={100}
                      animationDuration={1200}
                      animationEasing="ease-out"
                      activeIndex={activePieIndex}
                      activeShape={renderActiveShape}
                      onMouseEnter={(_, index) => setActivePieIndex(index)}
                      onMouseLeave={() => setActivePieIndex(-1)}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell
                          key={`category-${index}`}
                          fill={chartColors[index % chartColors.length]}
                          stroke="var(--card)"
                          strokeWidth={3}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        color: "var(--foreground)",
                      }}
                    />

                    <Legend verticalAlign="bottom" height={40} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* MONTHLY CASE REPORTS */}

          <div className="rounded-2xl border border-border bg-white p-6 dark:bg-[#252A32]">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Monthly Case Reports
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Monthly breakdown of reported crime incidents.
                </p>
              </div>

              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Total Cases
                </p>

                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {monthlyTotal}
                </p>
              </div>
            </div>

            {monthlyData.length === 0 ? (
              <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-border">
                <p className="text-sm text-muted-foreground">
                  No monthly data available.
                </p>
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyChartData}
                    margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      dy={8}
                    />

                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      width={40}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        color: "var(--foreground)",
                      }}
                      formatter={(value) => [value, "Cases"]}
                    />

                    <Line
                      type="monotone"
                      dataKey="cases"
                      name="Cases"
                      stroke="#6366F1"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#6366F1", strokeWidth: 0 }}
                      activeDot={{ r: 7, fill: "#6366F1" }}
                      isAnimationActive
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* MANAGEMENT CARDS */}

        <div className="mt-8">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-foreground">
              Management
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Select an option to manage the INCIDEX system.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {managementCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  to={card.path}
                  className="
                    group relative overflow-hidden rounded-2xl
                    border border-border bg-white p-5 shadow-sm
                    transition-all duration-300 ease-out
                    hover:-translate-y-2 hover:scale-[1.015]
                    hover:border-muted-foreground/30 hover:shadow-xl
                    dark:bg-[#252A32]
                  "
                >
                  <div
                    className="
                      pointer-events-none absolute -bottom-10 -right-10
                      h-28 w-28 rounded-full bg-muted/30
                      transition-transform duration-500
                      group-hover:scale-150
                    "
                  />

                  <div className="relative flex items-start justify-between">
                    <div
                      className={`
                        flex h-12 w-12 items-center justify-center
                        rounded-xl ${card.iconClass} shadow-sm
                        transition-all duration-300
                        group-hover:scale-110 group-hover:rotate-3
                      `}
                    >
                      <Icon size={22} />
                    </div>

                    <ArrowRight
                      size={19}
                      className="
                        text-muted-foreground transition-all duration-300
                        group-hover:translate-x-2 group-hover:text-foreground
                      "
                    />
                  </div>

                  <h4 className="relative mt-5 text-base font-semibold text-foreground">
                    {card.title}
                  </h4>

                  <p className="relative mt-1 text-sm text-muted-foreground">
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
