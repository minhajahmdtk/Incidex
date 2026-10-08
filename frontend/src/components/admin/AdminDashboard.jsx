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
  // ==================================================
  // DASHBOARD STATE
  // ==================================================

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
  const [activePieIndex, setActivePieIndex] = useState(-1);
  const [error, setError] = useState("");

  // ==================================================
  // GET DASHBOARD DATA
  // ==================================================

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

  // ==================================================
  // GET CATEGORY DATA
  // ==================================================

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

  // ==================================================
  // GET MONTHLY DATA
  // ==================================================

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

  // ==================================================
  // LOAD DATA
  // ==================================================

  useEffect(() => {
    getDashboardData();
    getCategoryData();
    getMonthlyData();
  }, []);

  // ==================================================
  // CATEGORY CHART DATA
  // ==================================================

  const categoryChartData = categoryData.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  // ==================================================
  // MONTHLY CHART DATA
  // ==================================================

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

  // ==================================================
  // CHART COLORS
  // NO RED / NO GREEN
  // ==================================================

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

  // ==================================================
  // ACTIVE PIE SHAPE
  // ==================================================

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

  // ==================================================
  // STATISTIC CARDS
  // ==================================================

  const statCards = [
    {
      title: "Total Users",
      value: dashboardData.totalUsers,
      icon: Users,
      iconClass:
        "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Total Cases",
      value: dashboardData.totalCases,
      icon: FileText,
      iconClass:
        "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    },
    {
      title: "New Cases",
      value: dashboardData.casesByStatus.new,
      icon: AlertCircle,
      iconClass:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Acknowledged",
      value: dashboardData.casesByStatus.acknowledged,
      icon: Clock,
      iconClass:
        "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
    {
      title: "In Progress",
      value: dashboardData.casesByStatus.inProgress,
      icon: Clock,
      iconClass:
        "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    },
    {
      title: "Resolved",
      value: dashboardData.casesByStatus.resolved,
      icon: CheckCircle,
      iconClass:
        "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    },
  ];

  // ==================================================
  // MANAGEMENT CARDS
  // ==================================================

  const managementCards = [
    {
      title: "Users",
      description: "View and manage registered users",
      path: "/admin/users",
      icon: Users,
      iconClass:
        "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Cases",
      description: "View and manage crime cases",
      path: "/admin/cases",
      icon: FileText,
      iconClass:
        "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    },
    {
      title: "Feedback",
      description: "View feedback submitted by users",
      path: "/admin/feedback",
      icon: MessageSquare,
      iconClass:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <AdminNavbar />

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ==================================================
            PAGE TITLE
        ================================================== */}

        <div className="mb-8">
          <h2
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
            Administrator Dashboard
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor and manage crime incident reports.
          </p>
        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-[#B94A48]/30 bg-[#B94A48]/5 p-4 dark:bg-[#D76562]/5">
            <p className="text-sm text-[#B94A48] dark:text-[#D76562]">
              {error}
            </p>
          </div>
        )}

        {/* ==================================================
            SIX STATISTIC CARDS
            NO SHADOW
        ================================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-border
                  bg-white
                  dark:bg-[#252A32]
                  p-5
                  transition-colors
                  duration-300
                  hover:border-muted-foreground/30
                "
              >
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                      {card.value}
                    </p>
                  </div>

                  <div
                    className={`
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      ${card.iconClass}
                      transition-transform
                      duration-300
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

        {/* ==================================================
            CHARTS
            NORMAL CARDS - NO 3D
        ================================================== */}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ==================================================
              CRIME CATEGORY PIE CHART
          ================================================== */}

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
                      label={({ name, value }) =>
                        `${name}: ${value}`
                      }
                      isAnimationActive={true}
                      animationBegin={100}
                      animationDuration={1200}
                      animationEasing="ease-out"
                      activeIndex={activePieIndex}
                      activeShape={renderActiveShape}
                      onMouseEnter={(_, index) =>
                        setActivePieIndex(index)
                      }
                      onMouseLeave={() => setActivePieIndex(-1)}
                    >
                      {categoryChartData.map(
                        (entry, index) => (
                          <Cell
                            key={`category-${index}`}
                            fill={
                              chartColors[
                                index % chartColors.length
                              ]
                            }
                            stroke="var(--card)"
                            strokeWidth={3}
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        color: "var(--foreground)",
                      }}
                    />

                    <Legend
                      verticalAlign="bottom"
                      height={40}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* ==================================================
              MONTHLY CASES LINE CHART
          ================================================== */}

          <div className="rounded-2xl border border-border bg-white p-6 dark:bg-[#252A32]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Monthly Case Reports
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Number of cases reported each month.
              </p>
            </div>

            {monthlyChartData.length === 0 ? (
              <div className="flex h-80 items-center justify-center">
                <p className="text-sm text-muted-foreground">
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
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />

                    <XAxis
                      dataKey="month"
                      stroke="var(--muted-foreground)"
                      tick={{
                        fill: "var(--muted-foreground)",
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                      stroke="var(--muted-foreground)"
                      tick={{
                        fill: "var(--muted-foreground)",
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        color: "var(--foreground)",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="cases"
                      name="Cases"
                      stroke="#6366F1"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                        fill: "#6366F1",
                      }}
                      activeDot={{
                        r: 8,
                        fill: "#6366F1",
                      }}
                      isAnimationActive={true}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* ==================================================
            MANAGEMENT
            3D EFFECT ONLY HERE
        ================================================== */}

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
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border
                    bg-white
                    dark:bg-[#252A32]
                    p-5
                    shadow-sm
                    transition-all
                    duration-300
                    ease-out
                    hover:-translate-y-2
                    hover:scale-[1.015]
                    hover:shadow-xl
                    hover:border-muted-foreground/30
                  "
                >
                  {/* 3D BACKGROUND ELEMENT */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -bottom-10
                      -right-10
                      h-28
                      w-28
                      rounded-full
                      bg-muted/30
                      transition-transform
                      duration-500
                      group-hover:scale-150
                    "
                  />

                  <div className="relative flex items-start justify-between">
                    <div
                      className={`
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        ${card.iconClass}
                        shadow-sm
                        transition-all
                        duration-300
                        group-hover:scale-110
                        group-hover:rotate-3
                      `}
                    >
                      <Icon size={22} />
                    </div>

                    <ArrowRight
                      size={19}
                      className="
                        text-muted-foreground
                        transition-all
                        duration-300
                        group-hover:translate-x-2
                        group-hover:text-foreground
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