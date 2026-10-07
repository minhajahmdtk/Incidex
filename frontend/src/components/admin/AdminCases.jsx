import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Eye,
  Search,
  X,
} from "lucide-react";
import axiosInstance from "../../axiosInterceptor";
import { toast } from "sonner";

const AdminCases = () => {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/admin/cases")
      .then((response) => {
        setCases(response.data.cases || response.data || []);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("loginToken");
          localStorage.removeItem("role");
          localStorage.removeItem("userInfo");

          toast.error("Session expired. Please login again.");

          navigate("/admin/login");
          return;
        }

        toast.error(
          error.response?.data?.message || "Failed to load cases"
        );

        setLoading(false);
      });
  }, [navigate]);

  const getStatusClass = (status) => {
    if (status === "New") {
      return "bg-[#B94A48]/10 text-[#B94A48] dark:bg-[#D76562]/10 dark:text-[#D76562]";
    }

    if (status === "Acknowledged") {
      return "bg-[#7FAF8A]/15 text-[#5F8D6A] dark:bg-[#7FAF8A]/15 dark:text-[#9BC7A4]";
    }

    if (status === "In Progress") {
      return "bg-muted text-muted-foreground";
    }

    if (status === "Resolved") {
      return "bg-[#7FAF8A]/15 text-[#5F8D6A] dark:bg-[#7FAF8A]/15 dark:text-[#9BC7A4]";
    }

    return "bg-muted text-muted-foreground";
  };

  // Search and filter cases
  const filteredCases = cases.filter((item) => {
    const search = searchText.trim().toLowerCase();

    const matchesSearch =
      !search ||
      item.caseId?.toLowerCase().includes(search) ||
      item.crimeCategory?.toLowerCase().includes(search) ||
      item.incidentLocation?.toLowerCase().includes(search) ||
      item.currentStatus?.toLowerCase().includes(search) ||
      item.userId?.name?.toLowerCase().includes(search) ||
      item.userId?.email?.toLowerCase().includes(search) ||
      item.userId?.phone?.toLowerCase().includes(search);

    const matchesCategory =
      !searchCategory ||
      item.crimeCategory === searchCategory;

    const matchesStatus =
      !searchStatus ||
      item.currentStatus === searchStatus;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus
    );
  });

  const clearSearch = () => {
    setSearchText("");
    setSearchCategory("");
    setSearchStatus("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <Link
              to="/admin/dashboard"
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-muted-foreground
                transition-colors
                duration-200
                hover:text-[#B94A48]
              "
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-3">

              {/* HEADER ICON */}
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#B94A48]/10
                  text-[#B94A48]
                  dark:bg-[#D76562]/10
                  dark:text-[#D76562]
                "
              >
                <FileText size={23} />
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
                  "
                >
                  Cases
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  View and manage reported crime cases
                </p>
              </div>

            </div>
          </div>

          {/* TOTAL CASES */}
          <div
            className="
              rounded-xl
              border
              border-border
              bg-card
              px-5
              py-4
              transition-colors
              duration-300
            "
          >
            <p className="text-xs font-medium text-muted-foreground">
              Total Cases
            </p>

            <p className="mt-1 text-2xl font-bold text-foreground">
              {cases.length}
            </p>
          </div>

        </div>

        {/* CASES CARD */}
        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-card
            transition-colors
            duration-300
          "
        >

          {/* HEADER + SEARCH */}
          <div className="border-b border-border px-6 py-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Reported Cases
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter reported crime cases
                </p>
              </div>

              {/* SEARCH BOX */}
              <div className="relative w-full lg:w-96">

                <Search
                  size={18}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />

                <input
                  type="text"
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(event.target.value)
                  }
                  placeholder="Search case, user, phone, location..."
                  className="
                    w-full
                    rounded-lg
                    border
                    border-input
                    bg-background
                    py-2.5
                    pl-10
                    pr-10
                    text-sm
                    text-foreground
                    outline-none
                    transition-colors
                    placeholder:text-muted-foreground
                    focus:border-[#B94A48]
                    focus:ring-1
                    focus:ring-[#B94A48]
                    dark:focus:border-[#D76562]
                    dark:focus:ring-[#D76562]
                  "
                />

                {searchText && (
                  <button
                    type="button"
                    onClick={() => setSearchText("")}
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-muted-foreground
                      transition-colors
                      hover:text-[#B94A48]
                    "
                  >
                    <X size={17} />
                  </button>
                )}

              </div>

            </div>

            {/* FILTERS */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">

              {/* CATEGORY */}
              <select
                value={searchCategory}
                onChange={(event) =>
                  setSearchCategory(event.target.value)
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-input
                  bg-background
                  px-3
                  py-2.5
                  text-sm
                  text-foreground
                  outline-none
                  transition-colors
                  sm:w-56
                  focus:border-[#B94A48]
                  focus:ring-1
                  focus:ring-[#B94A48]
                  dark:focus:border-[#D76562]
                  dark:focus:ring-[#D76562]
                "
              >
                <option value="">
                  All Categories
                </option>

                <option value="Theft">
                  Theft
                </option>

                <option value="Fraud">
                  Fraud
                </option>

                <option value="Cybercrime">
                  Cybercrime
                </option>

                <option value="Assault">
                  Assault
                </option>

                <option value="Vandalism">
                  Vandalism
                </option>

                <option value="Missing Person">
                  Missing Person
                </option>

                <option value="Accident">
                  Accident
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

              {/* STATUS */}
              <select
                value={searchStatus}
                onChange={(event) =>
                  setSearchStatus(event.target.value)
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-input
                  bg-background
                  px-3
                  py-2.5
                  text-sm
                  text-foreground
                  outline-none
                  transition-colors
                  sm:w-56
                  focus:border-[#B94A48]
                  focus:ring-1
                  focus:ring-[#B94A48]
                  dark:focus:border-[#D76562]
                  dark:focus:ring-[#D76562]
                "
              >
                <option value="">
                  All Statuses
                </option>

                <option value="New">
                  New
                </option>

                <option value="Acknowledged">
                  Acknowledged
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>
              </select>

              {/* CLEAR FILTERS */}
              {(searchText ||
                searchCategory ||
                searchStatus) && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-border
                    px-4
                    py-2.5
                    text-sm
                    text-muted-foreground
                    transition-colors
                    hover:bg-muted
                    hover:text-foreground
                  "
                >
                  <X size={16} />
                  Clear
                </button>
              )}

            </div>

            {/* RESULT COUNT */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredCases.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {cases.length}
                </span>{" "}
                cases
              </p>
            </div>

          </div>

          {/* LOADING */}
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center p-10">
              <div className="text-center">

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
                  Loading cases...
                </p>

              </div>
            </div>
          ) : filteredCases.length === 0 ? (

            /* NO RESULTS */
            <div className="flex min-h-[300px] items-center justify-center p-10">
              <div className="text-center">

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
                  <Search size={25} />
                </div>

                <p className="text-sm font-medium text-foreground">
                  No matching cases found.
                </p>

                {(searchText ||
                  searchCategory ||
                  searchStatus) && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="
                      mt-3
                      text-sm
                      font-medium
                      text-[#B94A48]
                      transition-colors
                      hover:text-[#A33F3D]
                      hover:underline
                      dark:text-[#D76562]
                      dark:hover:text-[#E17A77]
                    "
                  >
                    Clear search and filters
                  </button>
                )}

              </div>
            </div>

          ) : (

            /* CASES TABLE */
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead>
                  <tr className="border-b border-border bg-muted/40">

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-foreground
                      "
                    >
                      Case ID
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-foreground
                      "
                    >
                      Category
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-foreground
                      "
                    >
                      User
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-foreground
                      "
                    >
                      Location
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-foreground
                      "
                    >
                      Reported
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-foreground
                      "
                    >
                      Status
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-foreground
                      "
                    >
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {filteredCases.map((item) => (

                    <tr
                      key={item._id}
                      className="
                        border-b
                        border-border
                        transition-colors
                        duration-200
                        hover:bg-muted/40
                      "
                    >

                      {/* CASE ID */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">
                          {item.caseId}
                        </p>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-foreground">
                          {item.crimeCategory}
                        </p>
                      </td>

                      {/* USER */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {item.userId?.name || "N/A"}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {item.userId?.phone || ""}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {item.userId?.email || ""}
                          </p>
                        </div>
                      </td>

                      {/* LOCATION */}
                      <td className="px-6 py-4">
                        <p className="max-w-xs text-sm text-muted-foreground">
                          {item.incidentLocation || "N/A"}
                        </p>
                      </td>

                      {/* REPORT DATE */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-muted-foreground">
                          {item.reportDateTime
                            ? new Date(
                                item.reportDateTime
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                            item.currentStatus
                          )}`}
                        >
                          {item.currentStatus}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/cases/${item.caseId}`}
                          className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            bg-[#B94A48]
                            px-3
                            py-2
                            text-sm
                            text-white
                            transition-colors
                            hover:bg-[#A33F3D]
                            dark:bg-[#D76562]
                            dark:hover:bg-[#C55451]
                          "
                        >
                          <Eye size={16} />
                          View
                        </Link>
                      </td>

                    </tr>

                  ))}
                </tbody>

              </table>

            </div>
          )}

        </div>

      </main>
    </div>
  );
};

export default AdminCases;