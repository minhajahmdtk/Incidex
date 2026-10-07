import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminLogin = () => {
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
      .post("http://localhost:3000/admin/login", {
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

        localStorage.setItem("role", "admin");

        if (response.data.admin) {
          localStorage.setItem(
            "userInfo",
            JSON.stringify(response.data.admin)
          );
        }

        alert("Admin Login Successful");

        navigate("/admin/dashboard");
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
        min-h-screen
        bg-background
        text-foreground
        flex
        items-center
        justify-center
        px-4
        py-10
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
              text-2xl
              font-bold
              tracking-tight
              text-card-foreground
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
              placeholder="Enter admin password"
            />
          </div>

          {/* ERROR */}

          {error && (
            <div
              className="
                mt-4
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
              mt-5
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
            Admin Login
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