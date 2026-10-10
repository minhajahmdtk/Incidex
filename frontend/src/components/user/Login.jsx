import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, X } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleClose = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // EMAIL VALIDATION
    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    // PASSWORD VALIDATION
    if (!form.password) {
      setError("Password is required");
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      // COMMON LOGIN FOR USER AND ADMIN
      const response = await axios.post(
        "http://localhost:3000/user/login",
        {
          email: form.email.trim(),
          password: form.password,
        }
      );

      const { token, role, user, admin } = response.data;

      // CHECK RESPONSE
      if (!token || !["user", "admin"].includes(role)) {
        setError("Invalid login response from server");
        return;
      }

      // SAVE LOGIN TOKEN
      localStorage.setItem("loginToken", token);

      // SAVE ROLE RETURNED BY BACKEND
      localStorage.setItem("role", role);

      // SAVE ACCOUNT DETAILS
      const accountInfo = role === "admin" ? admin : user;

      if (accountInfo) {
        localStorage.setItem(
          "userInfo",
          JSON.stringify(accountInfo)
        );
      } else {
        localStorage.removeItem("userInfo");
      }

      toast.success("Login successful");

      // REDIRECT BASED ON ROLE
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Cannot connect to the backend server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50 px-4 py-6
        backdrop-blur-sm
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="
          relative w-full max-w-md
          rounded-2xl border border-border
          bg-card p-7 shadow-2xl shadow-black/20
          transition-colors duration-300 sm:p-8
        "
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={handleClose}
          className="
            absolute right-4 top-4
            rounded-lg p-2
            text-muted-foreground
            transition-colors duration-200
            hover:bg-accent hover:text-accent-foreground
          "
          aria-label="Close login"
        >
          <X size={20} />
        </button>

        {/* LOGO */}
        <div className="mb-6 flex justify-center">
          <Link
            to="/"
            onClick={handleClose}
            className="
              group flex h-20 w-20
              items-center justify-center
              rounded-full border border-border
              bg-background transition-all duration-200
              hover:scale-105
            "
            aria-label="Go to INCIDEX home page"
          >
            <img
              src="/Crime.png"
              alt="INCIDEX Logo"
              className="
                h-14 w-14 object-contain
                transition-transform duration-200
                group-hover:scale-105
              "
            />
          </Link>
        </div>

        {/* HEADING */}
        <div className="mb-6 text-center">
          <h2
            className="
              bg-gradient-to-r
              from-[#B94A48] via-[#7FAF8A] to-[#5F9F6B]
              bg-clip-text text-2xl font-bold tracking-tight
              text-transparent
              dark:from-[#D76562] dark:via-[#91BD9C] dark:to-[#7FBF8B]
            "
          >
            Welcome Back
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Login to your INCIDEX account.
          </p>

        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="
                mb-1.5 block text-sm font-medium
                text-card-foreground
              "
            >
              Email
            </label>

            <input
              id="email"
              className="
                w-full rounded-lg border border-input
                bg-background px-3.5 py-2.5
                text-sm text-foreground outline-none
                placeholder:text-muted-foreground
                transition
                focus:border-[#B94A48]
                focus:ring-2 focus:ring-[#B94A48]/10
              "
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="username"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mt-4">
            <label
              htmlFor="password"
              className="
                mb-1.5 block text-sm font-medium
                text-card-foreground
              "
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                className="
                  w-full rounded-lg border border-input
                  bg-background px-3.5 py-2.5 pr-11
                  text-sm text-foreground outline-none
                  placeholder:text-muted-foreground
                  transition
                  focus:border-[#B94A48]
                  focus:ring-2 focus:ring-[#B94A48]/10
                "
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              {/* SHOW / HIDE PASSWORD */}
              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="
                  absolute right-2.5 top-1/2
                  -translate-y-1/2 rounded-md p-1.5
                  text-muted-foreground
                  transition-colors duration-200
                  hover:bg-accent hover:text-foreground
                "
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="mb-5 mt-3 flex justify-end">
            <Link
              to="/forgot-password"
              className="
                text-sm font-medium text-[#B94A48]
                transition-colors hover:underline
              "
            >
              Forgot Password?
            </Link>
          </div>

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="
                mb-4 rounded-lg border
                border-[#B94A48]/30 bg-[#B94A48]/5
                p-3 text-sm text-[#B94A48]
                dark:bg-[#B94A48]/10
              "
            >
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full rounded-lg bg-primary
              py-2.5 text-sm font-semibold
              text-primary-foreground shadow-sm
              transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-md
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {/* REGISTER */}
          <p
            className="
              mt-5 text-center text-sm
              text-muted-foreground
            "
          >
            New user?{" "}

            <Link
              to="/register"
              className="
                font-medium text-[#B94A48]
                transition-colors hover:underline
              "
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

