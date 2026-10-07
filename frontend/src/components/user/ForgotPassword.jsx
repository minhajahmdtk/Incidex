import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/user/forgot-password",
        {
          email: email.trim(),
        }
      );

      setMessage(response.data.message);

      // Temporary development testing
      if (response.data.resetLink) {
        console.log("Reset Link:", response.data.resetLink);
      }
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
          w-full
          max-w-md
          rounded-2xl
          border
          border-border
          bg-card
          p-8
          shadow-sm
        "
      >
        {/* HEADING */}

        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            Forgot Password
          </h2>

          <p className="text-sm text-muted-foreground">
            Enter your registered email address to reset your password.
          </p>
        </div>

        {/* EMAIL */}

        <div className="mb-4">
          <label
            htmlFor="email"
            className="
              mb-1.5
              block
              text-sm
              font-medium
              text-foreground
            "
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setMessage("");
            }}
            placeholder="Enter your email"
            className="
              w-full
              rounded-lg
              border
              border-border
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
          </div>
        )}

        {/* SUBMIT */}

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
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* BACK TO LOGIN */}

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

export default ForgotPassword;