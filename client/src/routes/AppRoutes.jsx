import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Applications from "../pages/Applications";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <Applications />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-[#68436D]">
              404 · Page not found
            </p>
            <h1 className="mt-3 text-3xl font-black">
              This page wandered off.
            </h1>
            <p className="mt-3 text-[#5F5263]">
              The page you are looking for does not exist.
            </p>
            <a
              href="/"
              className="mt-6 rounded-xl bg-[#80558F] px-5 py-3 font-bold text-white"
            >
              Back to CareerPilot
            </a>
          </main>
        }
      />
    </Routes>
  );
}
