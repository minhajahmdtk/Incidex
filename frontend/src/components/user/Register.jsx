import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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

    // Remove error when user starts correcting the form
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    axios
      .post("http://localhost:3000/user/register", form)
      .then((response) => {
        alert("Registration Successful");

        console.log(
          "Registration Successful",
          response.data
        );

        navigate("/login");
      })
      .catch((error) => {
        setError(
          error.response?.data?.message ||
            "Registration failed"
        );

        console.error("Registration Error:", error);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <form
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-slate-200"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Create Account
        </h2>

        <p className="text-sm text-slate-500 mb-6">
          Register to report and track crime incidents.
        </p>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name
          </label>

          <input
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>

          <input
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone Number
          </label>

          <input
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>

          <input
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Confirm Password
          </label>

          <input
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-600"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Register Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Register
        </button>

        {/* Login Link */}
        <p className="text-sm text-center text-slate-600 mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;