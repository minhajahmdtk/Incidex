import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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


const ProtectedRoutes = ({ children }) => {
  const token = localStorage.getItem("loginToken");

  return token ? children : <Navigate to="/login" />;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />


        {/* User routes */}

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/user/profile"
          element={
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/user/report"
          element={
            <ProtectedRoutes>
              <ReportCrime />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/user/cases"
          element={
            <ProtectedRoutes>
              <MyCases />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/user/cases/:id"
          element={
            <ProtectedRoutes>
              <CaseDetails />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/user/notifications"
          element={
            <ProtectedRoutes>
              <Notifications />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/user/history"
          element={
            <ProtectedRoutes>
              <CrimeHistory />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/user/feedback/:id"
          element={
            <ProtectedRoutes>
              <Feedback />
            </ProtectedRoutes>
          }
        />


        {/* Admin routes */}

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/analytics"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

        <Route
          path="/admin/cases"
          element={<AdminCases />}
        />

        <Route
          path="/admin/cases/:id"
          element={<AdminCaseDetails />}
        />

        <Route
          path="/admin/notifications"
          element={<AdminNotifications />}
        />

        <Route
          path="/admin/history"
          element={<AdminHistory />}
        />

        <Route
          path="/admin/feedback"
          element={<AdminFeedback />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;