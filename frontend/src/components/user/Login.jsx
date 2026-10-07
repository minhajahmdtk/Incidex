import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { X } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    // Email validation
    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    // Password validation
    if (!form.password) {
      setError("Password is required");
      return;
    }

    axios
      .post("http://localhost:3000/user/login", {
        email: form.email,
        password: form.password,
      })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem(
            "loginToken",
            response.data.token
          );
        }

        localStorage.setItem("role", "user");

        if (response.data.user) {
          localStorage.setItem(
            "userInfo",
            JSON.stringify(response.data.user)
          );
        }

        alert("Login Successful");

        navigate("/user/dashboard");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setError(
            error.response.data.message ||
              "Login failed"
          );
        } else {
          setError(
            "Cannot connect to the backend server."
          );
        }
      });
  };

  return (
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
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="
          relative
          w-full
          max-w-md
          rounded-2xl
          border
          border-border
          bg-card
          p-7
          shadow-2xl
          shadow-black/20
          sm:p-8
        "
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}

        <button
          type="button"
          onClick={handleClose}
          className="
            absolute
            right-4
            top-4
            rounded-lg
            p-2
            text-muted-foreground
            transition-all
            duration-200
            hover:bg-[#B94A48]/10
            hover:text-[#B94A48]
            dark:hover:bg-[#D76562]/10
            dark:hover:text-[#D76562]
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
              group
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
                transition-transform
                duration-200
                group-hover:scale-105
              "
            />
          </Link>
        </div>

        {/* HEADING */}

        <div className="mb-6 text-center">
          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
              text-card-foreground
            "
          >
            Welcome Back
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-muted-foreground
            "
          >
            Login to your INCIDEX account.
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
              placeholder="Enter your email"
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
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          {/* FORGOT PASSWORD */}

          <div className="mb-5 mt-3 flex justify-end">
            <Link
              to="/forgot-password"
              className="
                text-sm
                font-medium
                text-[#B94A48]
                hover:underline
                dark:text-[#D76562]
              "
            >
              Forgot Password?
            </Link>
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

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="
              w-full
              rounded-lg
              bg-[#151A21]
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-[#343A40]
              hover:shadow-md
              dark:bg-[#E5E7EB]
              dark:text-[#151A21]
              dark:hover:bg-white
            "
          >
            Login
          </button>

          {/* REGISTER */}

          <p
            className="
              mt-5
              text-center
              text-sm
              text-muted-foreground
            "
          >
            New user?{" "}

            <Link
              to="/register"
              className="
                font-medium
                text-[#B94A48]
                hover:underline
                dark:text-[#D76562]
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