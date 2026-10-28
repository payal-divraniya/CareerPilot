import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const nextErrors = {};
    const email = formData.email.trim();

    if (!email) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password: formData.password,
      });

      if (!data?.user || !data?.token) {
        throw new Error("Invalid login response. Please try again.");
      }

      login(data.user, data.token);

      toast.success(data.message || "Login successful.");

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 500);
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7F1] text-[#423744]">
      <header className="border-b border-[#E8DDE7] bg-[#FFFCFA]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#80558F] font-black text-white">
              C
            </span>
            <span>
              <b className="block text-lg">CareerPilot</b>
              <small className="text-[10px] font-bold uppercase tracking-widest text-[#5F5263]">
                Job Application Tracker
              </small>
            </span>
          </Link>

          <p className="text-sm text-[#5F5263]">
            New here?{" "}
            <Link
              to="/register"
              className="ml-1 font-bold text-[#72547D] underline-offset-4 hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-5 py-12">
        <div className="w-full max-w-md animate-fade-up">
          <div className="mb-7 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#E9DDF1] text-2xl text-[#72547D]">
              ↗
            </div>

            <h1 className="mt-5 text-3xl font-black">Welcome back</h1>

            <p className="mt-2 text-[#5F5263]">
              Sign in to continue managing your job search.
            </p>
          </div>

          <div className="rounded-3xl border border-[#E8DDE7] bg-[#FFFCFA] p-6 shadow-xl shadow-[#9A849B]/10 sm:p-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold">
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`form-input ${errors.email ? "form-input-error" : ""}`}
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={`form-input pr-20 ${errors.password ? "form-input-error" : ""}`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-[#72547D] hover:bg-[#E9DDF1]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#80558F] px-5 py-3.5 font-bold text-white shadow-lg shadow-[#A47BB4]/20 transition hover:-translate-y-0.5 hover:bg-[#8F668F] disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in →"}
              </button>
            </form>

            <p className="mt-6 border-t border-[#E8DDE7] pt-5 text-center text-sm text-[#5F5263]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-[#72547D] hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-[#625566]">
            Your personal job application workspace.
          </p>
        </div>
      </main>
    </div>
  );
}
