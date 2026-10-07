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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
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
                mb-5
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
              <span className="text-lg font-bold">?</span>
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
              Forgot Password
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Enter your registered email address to reset your password.
            </p>
          </div>

          {/* EMAIL */}

          <div className="mb-5">
            <label
              htmlFor="email"
              className="
                mb-2
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
                px-3.5
                py-2.5
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
          </div>

          {/* ERROR */}

          {error && (
            <div
              className="
                mb-5
                rounded-xl
                border
                border-[#B94A48]/30
                bg-[#B94A48]/5
                p-3.5
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
                mb-5
                rounded-xl
                border
                border-[#7FAF8A]/30
                bg-[#7FAF8A]/10
                p-3.5
                text-sm
                text-[#5F8D6A]
                dark:border-[#91BD9C]/30
                dark:bg-[#91BD9C]/10
                dark:text-[#9BC7A4]
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
              flex
              w-full
              items-center
              justify-center
              rounded-lg
              bg-primary
              px-4
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
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {/* BACK TO LOGIN */}

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

export default ForgotPassword;