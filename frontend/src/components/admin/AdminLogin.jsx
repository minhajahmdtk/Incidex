import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      setError("email is required");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    // Password validation
    if (!form.password) {
      setError("password is required");
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

        localStorage.setItem("isLoggedIn", "true");
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <form
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-slate-200"
        onSubmit={handleSubmit}
      >
        {/* Heading */}

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Admin Login
        </h2>

        <p className="text-sm text-slate-500 mb-6">
          Login to your INCIDEX administrator account.
        </p>

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
            placeholder="Enter admin email"
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
            placeholder="Enter admin password"
          />
        </div>

        {/* Error Message */}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Login Button */}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Admin Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;