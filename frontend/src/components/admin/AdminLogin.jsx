import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Password validation
    if (!form.password) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/admin/login",
        {
          email: form.email,
          password: form.password,
        }
      );

      if (response.data.token) {
        localStorage.setItem(
          "loginToken",
          response.data.token
        );
      }

      localStorage.setItem("role", "admin");

      if (response.data.admin) {
        localStorage.setItem(
          "userInfo",
          JSON.stringify(response.data.admin)
        );
      }

      toast.success("Admin login successful!");

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 800);
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(
          error.response.data.message || "Login failed"
        );
      } else {
        toast.error(
          "Cannot connect to the backend server."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-background
        px-4
        py-10
        text-foreground
        transition-colors
        duration-300
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          border
          border-border
          bg-card
          p-7
          shadow-2xl
          shadow-black/10
          transition-colors
          duration-300
          sm:p-8
        "
      >
        {/* LOGO */}

        <div className="mb-6 flex justify-center">
          <Link
            to="/"
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              border
              border-border
              bg-background
              transition-all
              duration-200
              hover:scale-105
            "
            aria-label="Go to INCIDEX home page"
          >
            <img
              src="/Crime.png"
              alt="INCIDEX Logo"
              className="
                h-14
                w-14
                object-contain
              "
            />
          </Link>
        </div>

        {/* HEADING */}

        <div className="mb-6 text-center">
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
            Admin Login
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-muted-foreground
            "
          >
            Login to your INCIDEX administrator account.
          </p>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}

          <div>
            <label
              htmlFor="email"
              className="
                mb-1.5
                block
                text-sm
                font-medium
                text-card-foreground
              "
            >
              Email
            </label>

            <input
              id="email"
              className="
                w-full
                rounded-lg
                border
                border-input
                bg-background
                px-3.5
                py-2.5
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
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter admin email"
            />
          </div>

          {/* PASSWORD */}

          <div className="mt-4">
            <label
              htmlFor="password"
              className="
                mb-1.5
                block
                text-sm
                font-medium
                text-card-foreground
              "
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                className="
                  w-full
                  rounded-lg
                  border
                  border-input
                  bg-background
                  px-3.5
                  py-2.5
                  pr-11
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
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter admin password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="
                  absolute
                  right-2.5
                  top-1/2
                  -translate-y-1/2
                  rounded-md
                  p-1.5
                  text-muted-foreground
                  transition-colors
                  duration-200
                  hover:bg-accent
                  hover:text-foreground
                "
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
              mt-5
              w-full
              rounded-lg
              bg-primary
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
              disabled:cursor-not-allowed
              disabled:opacity-60
              disabled:hover:translate-y-0
              disabled:hover:shadow-sm
            "
          >
            {loading ? "Logging in..." : "Admin Login"}
          </button>

          {/* BACK TO HOME */}

          <p
            className="
              mt-5
              text-center
              text-sm
              text-muted-foreground
            "
          >
            <Link
              to="/"
              className="
                font-medium
                text-[#B94A48]
                transition-colors
                hover:underline
                dark:text-[#D76562]
              "
            >
              Back to Home
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;