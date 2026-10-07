import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Edit,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import axiosInstance from "../../axiosInterceptor";

const Profile = () => {
  const navigate = useNavigate();

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

        const userProfile = {
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        };

        setProfile(userProfile);
        setFormData(userProfile);
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

  // CLOSE DIALOG
  const handleClose = () => {
    setIsEditing(false);
    setErrorMessage("");
    navigate(-1);
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* BACKGROUND CONTENT */}
      <main className="min-h-[calc(100vh-72px)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div
            className="
              rounded-2xl
              border
              border-border
              bg-card
              p-8
              text-center
              shadow-sm
              transition-colors
              duration-300
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
                bg-[#B94A48]/10
                text-[#B94A48]
                dark:bg-[#D76562]/10
                dark:text-[#D76562]
              "
            >
              <User size={28} />
            </div>

            <h1
              className="
                bg-gradient-to-r
                from-[#B94A48]
                via-[#7FAF8A]
                to-[#555C64]
                bg-clip-text
                text-xl
                font-bold
                text-transparent
              "
            >
              Profile
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Profile dialog is open.
            </p>
          </div>
        </div>
      </main>

      {/* PROFILE DIALOG OVERLAY */}
      <div
        className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-black/50
          px-4
          py-6
          backdrop-blur-sm
        "
      >
        {/* PROFILE DIALOG */}
        <div
          className="
            relative
            max-h-[90vh]
            w-full
            max-w-2xl
            overflow-y-auto
            rounded-2xl
            border
            border-border
            bg-card
            shadow-2xl
            transition-colors
            duration-300
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-title"
        >
          {/* HEADER */}
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-border
              px-6
              py-5
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#B94A48]/10
                  text-[#B94A48]
                  dark:bg-[#D76562]/10
                  dark:text-[#D76562]
                "
              >
                <User size={24} />
              </div>

              <div>
                <h1
                  id="profile-title"
                  className="
                    bg-gradient-to-r
                    from-[#B94A48]
                    via-[#7FAF8A]
                    to-[#555C64]
                    bg-clip-text
                    text-xl
                    font-bold
                    text-transparent
                  "
                >
                  Profile
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  View and manage your personal information.
                </p>
              </div>
            </div>

            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={handleClose}
              className="
                rounded-lg
                p-2
                text-muted-foreground
                transition-all
                duration-200
                hover:bg-muted
                hover:text-foreground
              "
              title="Close"
              aria-label="Close profile"
            >
              <X size={20} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="px-6 py-6">
            {/* LOADING */}
            {loading ? (
              <div className="py-12 text-center">
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
                  Loading profile...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* NAME */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Full Name
                    </label>

                    <div className="relative">
                      <User
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
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`
                          w-full
                          rounded-lg
                          border
                          bg-background
                          py-3
                          pl-10
                          pr-4
                          text-sm
                          text-foreground
                          outline-none
                          transition-all
                          duration-200
                          placeholder:text-muted-foreground
                          disabled:cursor-default
                          disabled:opacity-70
                          ${
                            errorField === "name"
                              ? "border-[#B94A48] focus:border-[#B94A48] focus:ring-2 focus:ring-[#B94A48]/10 dark:border-[#D76562] dark:focus:border-[#D76562] dark:focus:ring-[#D76562]/10"
                              : "border-border focus:border-[#B94A48] focus:ring-2 focus:ring-[#B94A48]/10 dark:focus:border-[#D76562] dark:focus:ring-[#D76562]/10"
                          }
                        `}
                      />
                    </div>

                    {errorField === "name" && (
                      <p className="mt-2 text-sm text-[#B94A48] dark:text-[#D76562]">
                        {errorMessage}
                      </p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
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
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`
                          w-full
                          rounded-lg
                          border
                          bg-background
                          py-3
                          pl-10
                          pr-4
                          text-sm
                          text-foreground
                          outline-none
                          transition-all
                          duration-200
                          placeholder:text-muted-foreground
                          disabled:cursor-default
                          disabled:opacity-70
                          ${
                            errorField === "email"
                              ? "border-[#B94A48] focus:border-[#B94A48] focus:ring-2 focus:ring-[#B94A48]/10 dark:border-[#D76562] dark:focus:border-[#D76562] dark:focus:ring-[#D76562]/10"
                              : "border-border focus:border-[#B94A48] focus:ring-2 focus:ring-[#B94A48]/10 dark:focus:border-[#D76562] dark:focus:ring-[#D76562]/10"
                          }
                        `}
                      />
                    </div>

                    {errorField === "email" && (
                      <p className="mt-2 text-sm text-[#B94A48] dark:text-[#D76562]">
                        {errorMessage}
                      </p>
                    )}
                  </div>

                  {/* PHONE */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone
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
                        id="phone"
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`
                          w-full
                          rounded-lg
                          border
                          bg-background
                          py-3
                          pl-10
                          pr-4
                          text-sm
                          text-foreground
                          outline-none
                          transition-all
                          duration-200
                          placeholder:text-muted-foreground
                          disabled:cursor-default
                          disabled:opacity-70
                          ${
                            errorField === "phone"
                              ? "border-[#B94A48] focus:border-[#B94A48] focus:ring-2 focus:ring-[#B94A48]/10 dark:border-[#D76562] dark:focus:border-[#D76562] dark:focus:ring-[#D76562]/10"
                              : "border-border focus:border-[#B94A48] focus:ring-2 focus:ring-[#B94A48]/10 dark:focus:border-[#D76562] dark:focus:ring-[#D76562]/10"
                          }
                        `}
                      />
                    </div>

                    {errorField === "phone" && (
                      <p className="mt-2 text-sm text-[#B94A48] dark:text-[#D76562]">
                        {errorMessage}
                      </p>
                    )}
                  </div>

                  {/* OTHER BACKEND ERROR */}
                  {errorMessage && !errorField && (
                    <div
                      className="
                        rounded-lg
                        border
                        border-[#B94A48]/30
                        bg-[#B94A48]/5
                        px-4
                        py-3
                        dark:border-[#D76562]/30
                        dark:bg-[#D76562]/10
                      "
                    >
                      <p className="text-sm text-[#B94A48] dark:text-[#D76562]">
                        {errorMessage}
                      </p>
                    </div>
                  )}
                </div>

                {/* BUTTONS */}
                <div
                  className="
                    mt-7
                    flex
                    flex-col-reverse
                    gap-3
                    border-t
                    border-border
                    pt-5
                    sm:flex-row
                    sm:justify-end
                  "
                >
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-primary
                        px-5
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
                      <Edit size={17} />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          rounded-lg
                          border
                          border-border
                          bg-background
                          px-5
                          py-2.5
                          text-sm
                          font-medium
                          text-foreground
                          transition-all
                          duration-200
                          hover:bg-muted
                        "
                      >
                        <X size={17} />
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          rounded-lg
                          bg-primary
                          px-5
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
                        <Save size={17} />
                        Save Changes
                      </button>
                    </>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;