import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/user/Home";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Dashboard from "./components/user/Dashboard";
import Profile from "./components/user/Profile";
import ReportCrime from "./components/user/ReportCrime";
import MyCases from "./components/user/MyCases";
import CaseDetails from "./components/user/CaseDetails";
import Notifications from "./components/user/Notifications";
import CrimeHistory from "./components/user/CrimeHistory";
import Feedback from "./components/user/Feedback";

import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminCases from "./components/admin/AdminCases";
import AdminCaseDetails from "./components/admin/AdminCaseDetails";
import AdminNotifications from "./components/admin/AdminNotifications";
import AdminHistory from "./components/admin/AdminHistory";
import AdminFeedback from "./components/admin/AdminFeedback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User routes */}
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/report" element={<ReportCrime />} />
        <Route path="/user/cases" element={<MyCases />} />
        <Route path="/user/cases/:id" element={<CaseDetails />} />
        <Route path="/user/notifications" element={<Notifications />} />
        <Route path="/user/history" element={<CrimeHistory />} />
        <Route path="/user/feedback/:id" element={<Feedback />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/cases" element={<AdminCases />} />
        <Route path="/admin/cases/:id" element={<AdminCaseDetails />} />
        <Route
          path="/admin/notifications"
          element={<AdminNotifications />}
        />
        <Route path="/admin/history" element={<AdminHistory />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;