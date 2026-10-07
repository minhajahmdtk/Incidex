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
          error.response?.data?.message || "Failed to load users"
        );

        setLoading(false);
      });
  }, [navigate]);

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* PAGE HEADER */}
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
                <Users size={23} />
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
                  Users
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  View registered INCIDEX users
                </p>
              </div>
            </div>
          </div>

          {/* TOTAL USERS */}
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
              Total Users
            </p>

            <p className="mt-1 text-2xl font-bold text-foreground">
              {users.length}
            </p>
          </div>
        </div>

        {/* USERS CARD */}
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
          {/* CARD HEADER */}
          <div className="border-b border-border px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Registered Users
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  All users registered in the system
                </p>
              </div>

              {/* SEARCH */}
              <div className="relative w-full sm:w-72">
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
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Search by name"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-input
                    bg-background
                    py-2
                    pl-10
                    pr-3
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
              </div>
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
                  Loading users...
                </p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            /* EMPTY STATE */
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
                  <Users size={25} />
                </div>

                <p className="text-sm font-medium text-foreground">
                  {searchName
                    ? "No users found with that name."
                    : "No users found."}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Registered users will appear here.
                </p>
              </div>
            </div>
          ) : (
            /* USERS TABLE */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
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
                      Email
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
                      Phone
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
                      Registered
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="
                        border-b
                        border-border
                        transition-colors
                        duration-200
                        hover:bg-muted/40
                      "
                    >
                      {/* USER */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* USER AVATAR */}
                          <div
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-[#B94A48]/10
                              text-[#B94A48]
                              dark:bg-[#D76562]/10
                              dark:text-[#D76562]
                            "
                          >
                            <User size={17} />
                          </div>

                          <div>
                            <p className="font-medium text-foreground">
                              {user.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              User
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail size={16} />
                          {user.email}
                        </div>
                      </td>

                      {/* PHONE */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone size={16} />
                          {user.phone}
                        </div>
                      </td>

                      {/* REGISTERED DATE */}
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
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

export default AdminUsers;