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
          error.response?.data?.message ||
          "Failed to load cases"
        );

        setLoading(false);
      });
  }, [navigate]);

  const getStatusClass = (status) => {
    if (status === "New") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Acknowledged") {
      return "bg-amber-100 text-amber-700";
    }

    if (status === "In Progress") {
      return "bg-purple-100 text-purple-700";
    }

    if (status === "Resolved") {
      return "bg-green-100 text-green-700";
    }

    return "bg-slate-100 text-slate-700";
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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div>
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 mb-3"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText
                  size={24}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Cases
                </h1>

                <p className="text-sm text-slate-500">
                  View and manage reported crime cases
                </p>
              </div>
            </div>
          </div>

          {/* Total Cases */}
          <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
            <p className="text-xs text-slate-500">
              Total Cases
            </p>

            <p className="text-xl font-bold text-slate-900">
              {cases.length}
            </p>
          </div>

        </div>

        {/* Cases Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

          {/* Header + Search */}
          <div className="px-6 py-4 border-b border-slate-200">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Reported Cases
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Search and filter reported crime cases
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full lg:w-96">

                <Search
                  size={18}
                  className="absolute left-3 top-3 text-slate-400"
                />

                <input
                  type="text"
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(event.target.value)
                  }
                  placeholder="Search case, user, phone, location..."
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {searchText && (
                  <button
                    type="button"
                    onClick={() => setSearchText("")}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                  >
                    <X size={17} />
                  </button>
                )}

              </div>

            </div>

            {/* Filters */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">

              {/* Category */}
              <select
                value={searchCategory}
                onChange={(event) =>
                  setSearchCategory(event.target.value)
                }
                className="w-full sm:w-56 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

              {/* Status */}
              <select
                value={searchStatus}
                onChange={(event) =>
                  setSearchStatus(event.target.value)
                }
                className="w-full sm:w-56 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

              {/* Clear Filters */}
              {(searchText ||
                searchCategory ||
                searchStatus) && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <X size={16} />
                    Clear
                  </button>
                )}

            </div>

            {/* Result Count */}
            <div className="mt-4">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-700">
                  {filteredCases.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-700">
                  {cases.length}
                </span>{" "}
                cases
              </p>
            </div>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="p-10 text-center">
              <p className="text-slate-500">
                Loading cases...
              </p>
            </div>
          ) : filteredCases.length === 0 ? (

            /* No Results */
            <div className="p-10 text-center">
              <Search
                size={40}
                className="mx-auto text-slate-300 mb-3"
              />

              <p className="text-slate-500">
                No matching cases found.
              </p>

              {(searchText ||
                searchCategory ||
                searchStatus) && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="mt-3 text-sm font-medium text-blue-600 hover:underline"
                  >
                    Clear search and filters
                  </button>
                )}
            </div>

          ) : (

            /* Cases Table */
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Case ID
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Category
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      User
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Location
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Reported
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {filteredCases.map((item) => (

                    <tr
                      key={item._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >

                      {/* Case ID */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">
                          {item.caseId}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">
                          {item.crimeCategory}
                        </p>
                      </td>

                      {/* User */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {item.userId?.name || "N/A"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {item.userId?.phone || ""}
                          </p>

                          <p className="text-xs text-slate-500">
                            {item.userId?.email || ""}
                          </p>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 max-w-xs">
                          {item.incidentLocation || "N/A"}
                        </p>
                      </td>

                      {/* Report Date */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">
                          {item.reportDateTime
                            ? new Date(
                              item.reportDateTime
                            ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            item.currentStatus
                          )}`}
                        >
                          {item.currentStatus}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/cases/${item.caseId}`}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
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

      </div>
    </div>
  );
};

export default AdminCases;