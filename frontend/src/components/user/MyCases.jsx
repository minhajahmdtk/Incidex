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

        const response = await axiosInstance.get(
          "/cases/my-cases"
        );

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
        return "bg-muted text-muted-foreground border-border";

      case "Acknowledged":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900";

      case "In Progress":
        return "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-900/40 dark:text-stone-300 dark:border-stone-700";

      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900";

      default:
        return "bg-muted text-muted-foreground border-border";
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              My Cases
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              View and track all your reported crime incidents.
            </p>
          </div>

          {/* Search */}
          <div className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="relative max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-3.5 text-muted-foreground"
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
                  transition
                  focus:border-[#B94A48]
                  focus:ring-2
                  focus:ring-[#B94A48]/10
                  dark:focus:border-[#D76562]
                  dark:focus:ring-[#D76562]/10
                "
              />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
              <p className="text-sm text-muted-foreground">
                Loading your cases...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && errorMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
              <p className="text-sm text-red-600 dark:text-red-400">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="
                  mt-4
                  rounded-lg
                  bg-[#B94A48]
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-[#9F3F3D]
                  dark:bg-[#D76562]
                  dark:hover:bg-[#C95754]
                "
              >
                Try Again
              </button>
            </div>
          )}

          {/* No Cases */}
          {!loading &&
            !errorMessage &&
            cases.length === 0 && (
              <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <FileText
                    size={26}
                    className="text-muted-foreground"
                  />
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
                    bg-[#151A21]
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition-all
                    duration-200
                    hover:bg-[#343A40]
                    dark:bg-[#E5E7EB]
                    dark:text-[#151A21]
                    dark:hover:bg-white
                  "
                >
                  Report Crime
                </button>

              </div>
            )}

          {/* No Search Results */}
          {!loading &&
            !errorMessage &&
            cases.length > 0 &&
            filteredCases.length === 0 && (
              <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">

                <Search
                  size={28}
                  className="mx-auto text-muted-foreground"
                />

                <h2 className="mt-3 text-lg font-semibold text-foreground">
                  No Matching Cases
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Try another case ID, category or location.
                </p>

              </div>
            )}

          {/* Cases */}
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

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      {/* Case Information */}
                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-3">

                          <h2 className="text-lg font-semibold text-foreground">
                            {item.caseId}
                          </h2>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                              item.currentStatus
                            )}`}
                          >
                            {getStatusIcon(
                              item.currentStatus
                            )}

                            {item.currentStatus}
                          </span>

                        </div>

                        <p className="mt-2 text-sm font-medium text-foreground">
                          {item.crimeCategory}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.incidentLocation}
                        </p>

                        <p className="mt-2 text-xs text-muted-foreground">
                          Reported on{" "}
                          {formatDate(
                            item.reportDateTime
                          )}
                        </p>

                      </div>

                      {/* View Details */}
                      <div className="flex-shrink-0">

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/user/cases/${item.caseId}`
                            )
                          }
                          className="
                            flex
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