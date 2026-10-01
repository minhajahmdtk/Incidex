import axios from "axios";
import { useState } from "react"


const Login = () => {
  const [form,setForm]=useState({
    "email":'',
    "password":'',
  })
  const [loading,setLoading]=useState(false);

   function handleChange(e) {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }
   async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/user/login",
        form
      );

      console.log("Login successful:", response.data);

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login successful");

    } catch (error) {
      console.error("Login error:", error);

      alert(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-slate-900">
          INCIDEX
        </h1>

        <p className="text-center text-slate-500 mt-2">
          Crime Incident Reporting & Case Tracking System
        </p>

        <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
              required
            />

          </div>

          <div className="mb-6">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
              required
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
    </div>
  )
}

export default Login
