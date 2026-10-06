import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  User,
  Mail,
  Phone,
  Search,
} from "lucide-react";
import axiosInstance from "../../axiosInterceptor";
import { toast } from "sonner";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/admin/users")
      .then((response) => {
        setUsers(response.data.users || response.data || []);
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
            "Failed to load users"
        );

        setLoading(false);
      });
  }, [navigate]);

  const filteredUsers = users.filter((user) =>
    user.name
      ?.toLowerCase()
      .includes(searchName.toLowerCase())
  );

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
                <Users
                  size={24}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Users
                </h1>

                <p className="text-sm text-slate-500">
                  View registered INCIDEX users
                </p>
              </div>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
            <p className="text-xs text-slate-500">
              Total Users
            </p>

            <p className="text-xl font-bold text-slate-900">
              {users.length}
            </p>
          </div>

        </div>

        {/* Users Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

          {/* Card Header */}
          <div className="px-6 py-4 border-b border-slate-200">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Registered Users
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  All users registered in the system
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchName}
                  onChange={(e) =>
                    setSearchName(e.target.value)
                  }
                  placeholder="Search by name"
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm outline-none focus:border-blue-600"
                />

              </div>

            </div>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="p-10 text-center">
              <p className="text-slate-500">
                Loading users...
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (

            /* No Users */
            <div className="p-10 text-center">

              <Users
                size={40}
                className="mx-auto text-slate-300 mb-3"
              />

              <p className="text-slate-500">
                {searchName
                  ? "No users found with that name."
                  : "No users found."}
              </p>

            </div>

          ) : (

            /* Users Table */
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      User
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Email
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Phone
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Registered
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredUsers.map((user) => (

                    <tr
                      key={user._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >

                      {/* User */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">

                            <User
                              size={18}
                              className="text-blue-600"
                            />

                          </div>

                          <div>

                            <p className="font-medium text-slate-900">
                              {user.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              User
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-sm text-slate-600">

                          <Mail size={16} />

                          {user.email}

                        </div>

                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-sm text-slate-600">

                          <Phone size={16} />

                          {user.phone}

                        </div>

                      </td>

                      {/* Registered Date */}
                      <td className="px-6 py-4 text-sm text-slate-600">

                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString()
                          : "N/A"}

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

export default AdminUsers;