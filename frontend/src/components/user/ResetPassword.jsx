import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password) {
      toast.error("Password is required");
      return;
    }

    if (!form.confirmPassword) {
      toast.error("Confirm password is required");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/;

    if (!passwordRegex.test(form.password)) {
      toast.error(
        "Password must be 8 to 20 characters and contain uppercase, lowercase, number and special character"
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `http://localhost:3000/user/reset-password/${token}`,
        {
          password: form.password,
          confirmPassword: form.confirmPassword,
        }
      );

      toast.success(response.data.message || "Password changed successfully!");

      setForm({
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Cannot connect to the backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground transition-colors duration-300 sm:px-6">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="
            w-full
            max-w-md
            rounded-2xl
            border
            border-border
            bg-card
            p-6
            shadow-sm
            transition-colors
            duration-300
            sm:p-8
          "
        >
          {/* HEADER */}
          <div className="mb-7">
            <div
              className="
                mb-4
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
              <span className="text-lg font-bold">IC</span>
            </div>

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
              Reset Password
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Enter your new password below.
            </p>
          </div>

          {/* PASSWORD */}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              New Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="
                  w-full
                  rounded-lg
                  border
                  border-border
                  bg-background
                  px-4
                  py-3
                  pr-11
                  text-sm
                  text-foreground
                  outline-none
                  transition-all
                  duration-200
                  placeholder:text-muted-foreground
                  focus:border-[#B94A48]
                  focus:ring-2
                  focus:ring-[#B94A48]/10
                  dark:focus:border-[#D76562]
                  dark:focus:ring-[#D76562]/10
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
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
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-5">
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="
                  w-full
                  rounded-lg
                  border
                  border-border
                  bg-background
                  px-4
                  py-3
                  pr-11
                  text-sm
                  text-foreground
                  outline-none
                  transition-all
                  duration-200
                  placeholder:text-muted-foreground
                  focus:border-[#B94A48]
                  focus:ring-2
                  focus:ring-[#B94A48]/10
                  dark:focus:border-[#D76562]
                  dark:focus:ring-[#D76562]/10
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
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
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-lg
              bg-primary
              py-3
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
            {loading ? "Changing Password..." : "Change Password"}
          </button>

          {/* LOGIN LINK */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Remember your password?{" "}

            <Link
              to="/login"
              className="
                font-medium
                text-[#B94A48]
                transition-colors
                hover:underline
                dark:text-[#D76562]
              "
            >
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;