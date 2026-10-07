import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { X } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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

    axios
      .post("http://localhost:3000/user/register", form)
      .then((response) => {
        alert("Registration Successful");

        console.log("Registration Successful", response.data);

        navigate("/login");
      })
      .catch((error) => {
        setError(
          error.response?.data?.message || "Registration failed"
        );

        console.error("Registration Error:", error);
      });
  };

  const handleClose = () => {
    navigate("/");
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
      {/* ============================================================
          REGISTER DIALOG
      ============================================================ */}

      <div
        className="
          relative
          w-full
          max-w-xl
          max-h-[92vh]
          overflow-y-auto
          rounded-2xl
          border
          border-border
          bg-card
          p-6
          shadow-2xl
          sm:p-7
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
      >
        {/* Close Button */}

        <button
          type="button"
          onClick={handleClose}
          className="
            absolute
            right-4
            top-4
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            text-muted-foreground
            transition
            hover:bg-muted
            hover:text-foreground
          "
          aria-label="Close registration"
        >
          <X className="h-5 w-5" />
        </button>

        {/* ============================================================
            LOGO
        ============================================================ */}

        <div className="flex justify-center">
          <Link
            to="/"
            className="
              group
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              border
              border-border
              bg-background
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-md
            "
            aria-label="Go to INCIDEX home page"
          >
            <img
              src="/Crime.png"
              alt="INCIDEX Logo"
              className="
                h-11
                w-11
                object-contain
                transition-transform
                duration-200
                group-hover:scale-105
              "
            />
          </Link>
        </div>

        {/* ============================================================
            HEADING
        ============================================================ */}

        <div className="mt-3 text-center">
          <h2
            id="register-title"
            className="
              text-2xl
              font-bold
              tracking-tight
              text-card-foreground
            "
          >
            Create Account
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-muted-foreground
            "
          >
            Register to report and track crime incidents.
          </p>
        </div>

        {/* ============================================================
            REGISTER FORM
        ============================================================ */}

        <form
          className="mt-5"
          onSubmit={handleSubmit}
        >
          {/* Name + Phone */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-card-foreground
                "
              >
                Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
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
              />
            </div>

            {/* Phone */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-card-foreground
                "
              >
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
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
              />
            </div>
          </div>

          {/* Email */}

          <div className="mt-4">
            <label
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
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
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
            />
          </div>

          {/* Password + Confirm Password */}

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Password */}

            <div>
              <label
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
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
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
              />
            </div>

            {/* Confirm Password */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-card-foreground
                "
              >
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
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
              />
            </div>
          </div>

          {/* Error Message */}

          {error && (
            <div
              className="
                mt-4
                rounded-lg
                border
                border-red-200
                bg-red-50
                p-3
                text-sm
                text-red-600
                dark:border-red-900/50
                dark:bg-red-950/30
                dark:text-red-400
              "
            >
              {error}
            </div>
          )}

          {/* Register Button */}

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
            Register
          </button>

          {/* Login Link */}

          <p
            className="
              mt-4
              text-center
              text-sm
              text-muted-foreground
            "
          >
            Already have an account?{" "}

            <Link
              to="/login"
              className="
                font-medium
                text-[#B94A48]
                hover:underline
                dark:text-[#D76562]
              "
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;