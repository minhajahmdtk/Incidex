import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "./Navbar";
import axiosInstance from "../../axiosInterceptor";

const MyCases = () => {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getMyCases = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await axiosInstance.get("/cases/my-cases");

        setCases(response.data.cases || []);
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to load your cases";

        setErrorMessage(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    getMyCases();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "New":
        return `
          border-[#B94A48]/30
          bg-[#B94A48]/10
          text-[#B94A48]
          dark:border-[#D76562]/30
          dark:bg-[#D76562]/10
          dark:text-[#D76562]
        `;

      case "Acknowledged":
        return `
          border-[#7FAF8A]/30
          bg-[#7FAF8A]/15
          text-[#5F8D6A]
          dark:border-[#91BD9C]/30
          dark:bg-[#91BD9C]/10
          dark:text-[#9BC7A4]
        `;

      case "In Progress":
        return `
          border-border
          bg-muted
          text-muted-foreground
        `;

      case "Resolved":
        return `
          border-[#7FAF8A]/30
          bg-[#7FAF8A]/15
          text-[#5F8D6A]
          dark:border-[#91BD9C]/30
          dark:bg-[#91BD9C]/10
          dark:text-[#9BC7A4]
        `;

      default:
        return `
          border-border
          bg-muted
          text-muted-foreground
        `;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle size={16} />;

      case "In Progress":
        return <Clock size={16} />;

      case "Acknowledged":
        return <AlertCircle size={16} />;

      default:
        return <FileText size={16} />;
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredCases = cases.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.caseId?.toLowerCase().includes(searchText) ||
      item.crimeCategory?.toLowerCase().includes(searchText) ||
      item.currentStatus?.toLowerCase().includes(searchText) ||
      item.incidentLocation?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="min-h-screen">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* HEADER */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#B94A48]/10
                  text-[#B94A48]
                  dark:bg-[#D76562]/10
                  dark:text-[#D76562]
                "
              >
                <FileText size={22} />
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
                  My Cases
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  View and track all your reported crime incidents.
                </p>
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <div
            className="
              mb-6
              rounded-2xl
              border
              border-border
              bg-card
              p-4
              shadow-sm
              transition-colors
              duration-300
            "
          >
            <div className="relative max-w-md">
              <Search
                size={18}
                className="
                  absolute
                  left-3
                  top-3.5
                  text-muted-foreground
                "
              />

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
                placeholder="Search by case ID, category or location..."
                className="
                  w-full
                  rounded-lg
                  border
                  border-border
                  bg-background
                  py-3
                  pl-10
                  pr-4
                  text-sm
                  text-foreground
                  outline-none
                  placeholder:text-muted-foreground
                  transition-all
                  duration-200
                  focus:border-[#B94A48]
                  focus:ring-2
                  focus:ring-[#B94A48]/10
                  dark:focus:border-[#D76562]
                  dark:focus:ring-[#D76562]/10
                "
              />
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div
              className="
                rounded-2xl
                border
                border-border
                bg-card
                p-10
                text-center
                shadow-sm
              "
            >
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
                Loading your cases...
              </p>
            </div>
          )}

          {/* ERROR */}
          {!loading && errorMessage && (
            <div
              className="
                rounded-2xl
                border
                border-[#B94A48]/30
                bg-[#B94A48]/5
                p-6
                dark:border-[#D76562]/30
                dark:bg-[#D76562]/10
              "
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={20}
                  className="
                    mt-0.5
                    shrink-0
                    text-[#B94A48]
                    dark:text-[#D76562]
                  "
                />

                <div>
                  <p className="text-sm text-[#B94A48] dark:text-[#D76562]">
                    {errorMessage}
                  </p>

                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="
                      mt-4
                      rounded-lg
                      bg-primary
                      px-4
                      py-2
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
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NO CASES */}
          {!loading &&
            !errorMessage &&
            cases.length === 0 && (
              <div
                className="
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  p-10
                  text-center
                  shadow-sm
                "
              >
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
                  <FileText size={26} />
                </div>

                <h2 className="text-lg font-semibold text-foreground">
                  No Cases Found
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  You have not reported any crime incidents yet.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/user/report")}
                  className="
                    mt-5
                    inline-flex
                    items-center
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
                    hover:-translate-y-0.5
                    hover:bg-primary
                    hover:text-primary-foreground
                    hover:shadow-md
                  "
                >
                  Report Crime
                </button>
              </div>
            )}

          {/* NO SEARCH RESULTS */}
          {!loading &&
            !errorMessage &&
            cases.length > 0 &&
            filteredCases.length === 0 && (
              <div
                className="
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  p-10
                  text-center
                  shadow-sm
                "
              >
                <div
                  className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-muted
                    text-muted-foreground
                  "
                >
                  <Search size={24} />
                </div>

                <h2 className="mt-3 text-lg font-semibold text-foreground">
                  No Matching Cases
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Try another case ID, category or location.
                </p>
              </div>
            )}

          {/* CASES */}
          {!loading &&
            !errorMessage &&
            filteredCases.length > 0 && (
              <div className="space-y-4">
                {filteredCases.map((item) => (
                  <div
                    key={item._id}
                    className="
                      rounded-2xl
                      border
                      border-border
                      bg-card
                      p-5
                      shadow-sm
                      transition-all
                      duration-200
                      hover:shadow-md
                    "
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      {/* CASE INFORMATION */}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-lg font-semibold text-foreground">
                            {item.caseId}
                          </h2>

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
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
                            {getStatusIcon(item.currentStatus)}
                            {item.currentStatus}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                              Crime Category
                            </p>

                            <p className="mt-1 text-sm font-medium text-foreground">
                              {item.crimeCategory}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                              Reported On
                            </p>

                            <p className="mt-1 text-sm text-foreground">
                              {formatDate(item.reportDateTime)}
                            </p>
                          </div>

                          <div className="sm:col-span-2">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                              Incident Location
                            </p>

                            <p className="mt-1 truncate text-sm text-muted-foreground">
                              {item.incidentLocation}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* VIEW DETAILS */}
                      <div className="shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/user/cases/${item.caseId}`
                            )
                          }
                          className="
                            inline-flex
                            w-full
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
                            lg:w-auto
                          "
                        >
                          <Eye size={17} />
                          View Details
                        </button>
                      </div>
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

export default MyCases;