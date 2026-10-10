import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "./Navbar";
import axiosInstance from "../../axiosInterceptor";

const Dashboard = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/cases/my-cases")
      .then((response) => {
        console.log(response.data);

        setCases(response.data.cases || response.data);
      })
      .catch((error) => {
        console.log(error);

        toast.error(
          error.response?.data?.message || "Failed to load cases"
        );
      });
  }, []);

  const totalCases = cases.length;

  const newCases = cases.filter(
    (item) => item.currentStatus === "New"
  ).length;

  const inProgressCases = cases.filter(
    (item) => item.currentStatus === "In Progress"
  ).length;

  const resolvedCases = cases.filter(
    (item) => item.currentStatus === "Resolved"
  ).length;

  const recentCases = cases
    .slice()
    .sort((a, b) => {
      return (
        new Date(b.reportDateTime || b.createdAt) -
        new Date(a.reportDateTime || a.createdAt)
      );
    })
    .slice(0, 5);

  const getStatusStyle = (status) => {
    if (status === "New") {
      return `
        border-[#B94A48]/30
        bg-[#B94A48]/10
        text-[#B94A48]
        dark:border-[#D76562]/30
        dark:bg-[#D76562]/10
        dark:text-[#D76562]
      `;
    }

    if (status === "Acknowledged") {
      return `
        border-[#7FAF8A]/30
        bg-[#7FAF8A]/15
        text-[#5F8D6A]
        dark:border-[#91BD9C]/30
        dark:bg-[#91BD9C]/10
        dark:text-[#9BC7A4]
      `;
    }

    if (status === "In Progress") {
      return `
        border-border
        bg-muted
        text-muted-foreground
      `;
    }

    if (status === "Resolved") {
      return `
        border-[#7FAF8A]/30
        bg-[#7FAF8A]/15
        text-[#5F8D6A]
        dark:border-[#91BD9C]/30
        dark:bg-[#91BD9C]/10
        dark:text-[#9BC7A4]
      `;
    }

    return `
      border-border
      bg-muted
      text-muted-foreground
    `;
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="min-h-screen">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                Welcome back
              </p>

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
                Dashboard
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Track your reported incidents and stay updated.
              </p>
            </div>

            {/* REPORT CRIME */}

            <Link
              to="/user/report"
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-lg
                bg-primary
                px-5
                py-3
                text-sm
                font-semibold
                text-primary-foreground
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-primary
                hover:text-primary-foreground
                hover:shadow-md
              "
            >
              <Plus size={18} />
              Report Crime
            </Link>
          </div>

          {/* ==================================================
              STATISTICS
          ================================================== */}

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* TOTAL CASES */}

            <div
              className="
                rounded-xl
                border
                border-border
                bg-card
                p-5
                shadow-sm
                transition-colors
                duration-300
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Cases
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-foreground">
                    {totalCases}
                  </h2>
                </div>

                <div
                  className="
                    rounded-lg
                    bg-muted
                    p-3
                    text-muted-foreground
                  "
                >
                  <FileText size={24} />
                </div>
              </div>
            </div>

            {/* NEW CASES */}

            <div
              className="
                rounded-xl
                border
                border-border
                bg-card
                p-5
                shadow-sm
                transition-colors
                duration-300
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    New Cases
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-foreground">
                    {newCases}
                  </h2>
                </div>

                <div
                  className="
                    rounded-lg
                    bg-[#B94A48]/10
                    p-3
                    text-[#B94A48]
                    dark:bg-[#D76562]/10
                    dark:text-[#D76562]
                  "
                >
                  <AlertCircle size={24} />
                </div>
              </div>
            </div>

            {/* IN PROGRESS */}

            <div
              className="
                rounded-xl
                border
                border-border
                bg-card
                p-5
                shadow-sm
                transition-colors
                duration-300
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    In Progress
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-foreground">
                    {inProgressCases}
                  </h2>
                </div>

                <div
                  className="
                    rounded-lg
                    bg-muted
                    p-3
                    text-muted-foreground
                  "
                >
                  <Clock size={24} />
                </div>
              </div>
            </div>

            {/* RESOLVED */}

            <div
              className="
                rounded-xl
                border
                border-border
                bg-card
                p-5
                shadow-sm
                transition-colors
                duration-300
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Resolved
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-foreground">
                    {resolvedCases}
                  </h2>
                </div>

                <div
                  className="
                    rounded-lg
                    bg-[#7FAF8A]/15
                    p-3
                    text-[#5F8D6A]
                    dark:bg-[#91BD9C]/10
                    dark:text-[#9BC7A4]
                  "
                >
                  <CheckCircle size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              RECENT CASES
          ================================================== */}

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
            {/* RECENT CASES HEADER */}

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
                <h2 className="text-lg font-semibold text-foreground">
                  Recent Cases
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your latest reported incidents
                </p>
              </div>

              <Link
                to="/user/cases"
                className="
                  flex
                  items-center
                  gap-1
                  text-sm
                  font-medium
                  text-muted-foreground
                  transition-colors
                  hover:text-[#B94A48]
                  dark:hover:text-[#D76562]
                "
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* ==================================================
                NO CASES
            ================================================== */}

            {recentCases.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div
                  className="
                    mx-auto
                    mb-4
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-muted
                    text-muted-foreground
                  "
                >
                  <FileText size={25} />
                </div>

                <h3 className="text-base font-semibold text-foreground">
                  No cases reported yet
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your reported incidents will appear here.
                </p>

                <Link
                  to="/user/report"
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-primary
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-primary-foreground
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-primary
                    hover:text-primary-foreground
                    hover:shadow-md
                  "
                >
                  <Plus size={17} />
                  Report Crime
                </Link>
              </div>
            ) : (
              /* ==================================================
                  TABLE
              ================================================== */

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">

                  {/* TABLE HEADER */}

                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th
                        className="
                          px-5
                          py-4
                          text-left
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-muted-foreground
                        "
                      >
                        Case ID
                      </th>

                      <th
                        className="
                          px-5
                          py-4
                          text-left
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-muted-foreground
                        "
                      >
                        Category
                      </th>

                      <th
                        className="
                          px-5
                          py-4
                          text-left
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-muted-foreground
                        "
                      >
                        Location
                      </th>

                      <th
                        className="
                          px-5
                          py-4
                          text-left
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-muted-foreground
                        "
                      >
                        Date
                      </th>

                      <th
                        className="
                          px-5
                          py-4
                          text-left
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-muted-foreground
                        "
                      >
                        Status
                      </th>

                      <th
                        className="
                          px-5
                          py-4
                          text-left
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-muted-foreground
                        "
                      >
                        Action
                      </th>
                    </tr>
                  </thead>

                  {/* TABLE BODY */}

                  <tbody>
                    {recentCases.map((item) => (
                      <tr
                        key={item._id}
                        className="
                          border-b
                          border-border
                          transition-colors
                          duration-200
                          last:border-b-0
                          hover:bg-muted/40
                        "
                      >
                        {/* CASE ID */}

                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-foreground">
                            {item.caseId}
                          </span>
                        </td>

                        {/* CATEGORY */}

                        <td className="px-5 py-4">
                          <span className="text-sm text-foreground">
                            {item.crimeCategory}
                          </span>
                        </td>

                        {/* LOCATION */}

                        <td className="max-w-xs px-5 py-4">
                          <span className="block truncate text-sm text-muted-foreground">
                            {item.location}
                          </span>
                        </td>

                        {/* DATE */}

                        <td className="whitespace-nowrap px-5 py-4">
                          <span className="text-sm text-muted-foreground">
                            {new Date(
                              item.reportDateTime ||
                                item.createdAt
                            ).toLocaleDateString("en-IN")}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <span
                            className={`
                              inline-flex
                              rounded-full
                              border
                              px-3
                              py-1
                              text-xs
                              font-medium
                              ${getStatusStyle(
                                item.currentStatus
                              )}
                            `}
                          >
                            {item.currentStatus}
                          </span>
                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4">
                          <Link
                            to={`/user/cases/${item.caseId}`}
                            className="
                              inline-flex
                              items-center
                              gap-1
                              text-sm
                              font-medium
                              text-[#B94A48]
                              transition-colors
                              hover:underline
                              dark:text-[#D76562]
                            "
                          >
                            View
                            <ArrowRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;