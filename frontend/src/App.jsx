import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// User components
import Home from "./components/user/Home";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import ForgotPassword from "./components/user/ForgotPassword";
import ResetPassword from "./components/user/ResetPassword";
import Dashboard from "./components/user/Dashboard";
import Profile from "./components/user/Profile";
import ReportCrime from "./components/user/ReportCrime";
import MyCases from "./components/user/MyCases";
import CaseDetails from "./components/user/CaseDetails";
import Notifications from "./components/user/Notifications";
import Feedback from "./components/user/Feedback";

// Admin components
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminCases from "./components/admin/AdminCases";
import AdminCaseDetails from "./components/admin/AdminCaseDetails";
import AdminNotifications from "./components/admin/AdminNotifications";
import AdminFeedback from "./components/admin/AdminFeedback";

/*
  USER PROTECTED ROUTES

  Only logged-in users can access
  the user pages.
*/
const UserProtectedRoutes = ({ children }) => {
  const token = localStorage.getItem("loginToken");
  const role = localStorage.getItem("role");

  if (!token || role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/*
  ADMIN PROTECTED ROUTES

  Only logged-in administrators can access
  the admin pages.
*/
const AdminProtectedRoutes = ({ children }) => {
  const token = localStorage.getItem("loginToken");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================== */}

        {/* Home */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* Login Modal Over Home */}

        <Route
          path="/login"
          element={
            <>
              <Home />
              <Login />
            </>
          }
        />

        {/* Register Modal Over Home */}

        <Route
          path="/register"
          element={
            <>
              <Home />
              <Register />
            </>
          }
        />

        {/* FORGOT PASSWORD */}

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* RESET PASSWORD */}

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* ADMIN LOGIN */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* =========================
            USER ROUTES
        ========================== */}

        <Route
          path="/user/dashboard"
          element={
            <UserProtectedRoutes>
              <Dashboard />
            </UserProtectedRoutes>
          }
        />

        <Route
          path="/user/profile"
          element={
            <UserProtectedRoutes>
              <Profile />
            </UserProtectedRoutes>
          }
        />

        <Route
          path="/user/report"
          element={
            <UserProtectedRoutes>
              <ReportCrime />
            </UserProtectedRoutes>
          }
        />

        <Route
          path="/user/cases"
          element={
            <UserProtectedRoutes>
              <MyCases />
            </UserProtectedRoutes>
          }
        />

        <Route
          path="/user/cases/:id"
          element={
            <UserProtectedRoutes>
              <CaseDetails />
            </UserProtectedRoutes>
          }
        />

        <Route
          path="/user/notifications"
          element={
            <UserProtectedRoutes>
              <Notifications />
            </UserProtectedRoutes>
          }
        />

        <Route
          path="/user/feedback/:id"
          element={
            <UserProtectedRoutes>
              <Feedback />
            </UserProtectedRoutes>
          }
        />

        {/* =========================
            ADMIN ROUTES
        ========================== */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoutes>
              <AdminDashboard />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <AdminProtectedRoutes>
              <AdminDashboard />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoutes>
              <AdminUsers />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/admin/cases"
          element={
            <AdminProtectedRoutes>
              <AdminCases />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/admin/cases/:id"
          element={
            <AdminProtectedRoutes>
              <AdminCaseDetails />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/admin/notifications"
          element={
            <AdminProtectedRoutes>
              <AdminNotifications />
            </AdminProtectedRoutes>
          }
        />

        <Route
          path="/admin/feedback"
          element={
            <AdminProtectedRoutes>
              <AdminFeedback />
            </AdminProtectedRoutes>
          }
        />

        {/* =========================
            UNKNOWN ROUTES
        ========================== */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;