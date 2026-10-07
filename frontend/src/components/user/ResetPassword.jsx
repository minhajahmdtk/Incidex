import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!form.password) {
      setError("Password is required");
      return;
    }

    if (!form.confirmPassword) {
      setError("Confirm password is required");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/;

    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must be 8 to 20 characters and contain uppercase, lowercase, number and special character"
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
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

      setMessage(response.data.message);

      setForm({
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Cannot connect to the backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-md
          rounded-2xl
          border border-border
          bg-card
          p-8
          shadow-sm
        "
      >
        {/* HEADER */}

        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            Reset Password
          </h2>

          <p className="text-sm text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        {/* PASSWORD */}

        <div className="mb-4">
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            New Password
          </label>

          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter new password"
            className="
              w-full
              rounded-lg
              border border-border
              bg-background
              px-3
              py-2.5
              text-foreground
              outline-none
              transition-all
              duration-200
              placeholder:text-muted-foreground
              focus:border-[#B94A48]
              focus:ring-2
              focus:ring-[#B94A48]/10
            "
          />
        </div>

        {/* CONFIRM PASSWORD */}

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            className="
              w-full
              rounded-lg
              border border-border
              bg-background
              px-3
              py-2.5
              text-foreground
              outline-none
              transition-all
              duration-200
              placeholder:text-muted-foreground
              focus:border-[#B94A48]
              focus:ring-2
              focus:ring-[#B94A48]/10
            "
          />
        </div>

        {/* ERROR */}

        {error && (
          <div
            className="
              mb-4
              rounded-lg
              border
              border-[#B94A48]/30
              bg-[#B94A48]/5
              p-3
              text-sm
              text-[#B94A48]
              dark:border-[#D76562]/30
              dark:bg-[#D76562]/10
              dark:text-[#D76562]
            "
          >
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {message && (
          <div
            className="
              mb-4
              rounded-lg
              border
              border-emerald-200
              bg-emerald-50
              p-3
              text-sm
              text-emerald-700
              dark:border-emerald-900
              dark:bg-emerald-950/30
              dark:text-emerald-400
            "
          >
            {message}

            <div className="mt-1 text-xs">
              Redirecting to login...
            </div>
          </div>
        )}

        {/* BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            rounded-lg
            bg-[#151A21]
            py-2.5
            font-medium
            text-white
            transition-all
            duration-200
            hover:bg-[#343A40]
            disabled:cursor-not-allowed
            disabled:opacity-60
            dark:bg-[#E5E7EB]
            dark:text-[#151A21]
            dark:hover:bg-white
          "
        >
          {loading ? "Changing Password..." : "Change Password"}
        </button>

        {/* LOGIN LINK */}

        <p className="mt-5 text-center text-sm text-muted-foreground">
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
  );
};

export default ResetPassword;