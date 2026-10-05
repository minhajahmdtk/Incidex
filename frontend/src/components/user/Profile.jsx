import { useEffect, useState } from "react";
import { User, Mail, Phone, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import Navbar from "./Navbar";
import axiosInstance from "../../axiosInterceptor";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  // GET PROFILE

  useEffect(() => {
    axiosInstance
      .get("/user/profile")
      .then((response) => {
        const user = response.data.user;

        setProfile({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });

        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load profile"
        );

        setLoading(false);
      });
  }, []);

  // HANDLE INPUT

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setErrorMessage("");
  };

  // EDIT PROFILE

  const handleEdit = () => {
    setFormData(profile);
    setErrorMessage("");
    setIsEditing(true);
  };

  // CANCEL EDIT

  const handleCancel = () => {
    setFormData(profile);
    setErrorMessage("");
    setIsEditing(false);
  };

  // UPDATE PROFILE

  const handleSubmit = (event) => {
    event.preventDefault();

    setErrorMessage("");

    axiosInstance
      .put("/user/update", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      })
      .then((response) => {
        const updatedUser = response.data.user;

        const newProfile = {
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
        };

        setProfile(newProfile);
        setFormData(newProfile);

        localStorage.setItem(
          "userInfo",
          JSON.stringify(newProfile)
        );

        setIsEditing(false);

        toast.success(
          response.data.message ||
            "Profile updated successfully"
        );
      })
      .catch((error) => {
        console.log(error);

        const message =
          error.response?.data?.message ||
          "Failed to update profile";

        setErrorMessage(message);
      });
  };

  // CHECK WHICH FIELD HAS ERROR

  const getErrorField = () => {
    if (
      errorMessage.toLowerCase().includes("name")
    ) {
      return "name";
    }

    if (
      errorMessage.toLowerCase().includes("email")
    ) {
      return "email";
    }

    if (
      errorMessage.toLowerCase().includes("phone")
    ) {
      return "phone";
    }

    return "";
  };

  const errorField = getErrorField();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="min-h-screen lg:ml-72">
        <div className="px-4 py-6 sm:px-6 lg:px-8">

          {/* Header */}

          <div className="mb-8">
            <p className="mb-1 text-sm font-medium text-slate-500">
              Account
            </p>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Profile
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              View and manage your personal information.
            </p>
          </div>

          {/* Loading */}

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-slate-500">
                Loading profile...
              </p>
            </div>
          ) : (
            <div className="max-w-3xl">

              {/* Profile Card */}

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                {/* Card Header */}

                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                        <User
                          size={28}
                          className="text-blue-600"
                        />
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          Personal Information
                        </h2>

                        <p className="text-sm text-slate-500">
                          Your registered account details
                        </p>
                      </div>

                    </div>

                    {!isEditing && (
                      <button
                        type="button"
                        onClick={handleEdit}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                    )}

                  </div>
                </div>

                {/* Form */}

                <form onSubmit={handleSubmit}>

                  <div className="space-y-6 px-6 py-6">

                    {/* Name */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Full Name
                      </label>

                      <div className="relative">

                        <User
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`w-full rounded-lg border bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:ring-2 disabled:cursor-default disabled:text-slate-600 ${
                            errorField === "name"
                              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                              : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                          }`}
                        />

                      </div>

                      {errorField === "name" && (
                        <p className="mt-2 text-sm text-red-600">
                          {errorMessage}
                        </p>
                      )}
                    </div>

                    {/* Email */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Email Address
                      </label>

                      <div className="relative">

                        <Mail
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`w-full rounded-lg border bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:ring-2 disabled:cursor-default disabled:text-slate-600 ${
                            errorField === "email"
                              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                              : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                          }`}
                        />

                      </div>

                      {errorField === "email" && (
                        <p className="mt-2 text-sm text-red-600">
                          {errorMessage}
                        </p>
                      )}
                    </div>

                    {/* Phone */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Phone Number
                      </label>

                      <div className="relative">

                        <Phone
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`w-full rounded-lg border bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:ring-2 disabled:cursor-default disabled:text-slate-600 ${
                            errorField === "phone"
                              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                              : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                          }`}
                        />

                      </div>

                      {errorField === "phone" && (
                        <p className="mt-2 text-sm text-red-600">
                          {errorMessage}
                        </p>
                      )}
                    </div>

                    {/* Other Backend Error */}

                    {errorMessage && !errorField && (
                      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm text-red-600">
                          {errorMessage}
                        </p>
                      </div>
                    )}

                  </div>

                  {/* Buttons */}

                  {isEditing && (
                    <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

                      <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <X size={17} />
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        <Save size={17} />
                        Save Changes
                      </button>

                    </div>
                  )}

                </form>

              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Profile;