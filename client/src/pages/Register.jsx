import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
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
    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name) {
      nextErrors.name = "Full name is required.";
    } else if (name.length < 2) {
      nextErrors.name = "Name must contain at least 2 characters.";
    }

    if (!email) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      nextErrors.password = "Password must contain at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.terms) {
      nextErrors.terms = "Please accept the terms to continue.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    try {
      const data = await registerUser({
        name,
        email,
        password: formData.password,
      });

      toast.success(
        data.message || "Account created successfully. Redirecting to login...",
      );

      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordField = (name, label, visible, toggle, error, placeholder) => (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-bold">
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          value={formData[name]}
          onChange={handleChange}
          autoComplete="new-password"
          placeholder={placeholder}
          className={`form-input pr-20 ${error ? "form-input-error" : ""}`}
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-[#72547D] hover:bg-[#E9DDF1]"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );

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
            Have an account?{" "}
            <Link
              to="/login"
              className="ml-1 font-bold text-[#72547D] hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-5 py-10">
        <div className="w-full max-w-lg animate-fade-up">
          <div className="mb-7 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#F7D9D5] text-2xl text-[#824247]">
              ✦
            </div>

            <h1 className="mt-5 text-3xl font-black">Create your account</h1>

            <p className="mt-2 text-[#5F5263]">
              Set up your personal job-tracking workspace.
            </p>
          </div>

          <div className="rounded-3xl border border-[#E8DDE7] bg-[#FFFCFA] p-6 shadow-xl shadow-[#9A849B]/10 sm:p-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-bold">
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className={`form-input ${errors.name ? "form-input-error" : ""}`}
                />

                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

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

              {passwordField(
                "password",
                "Password",
                showPassword,
                () => setShowPassword((value) => !value),
                errors.password,
                "At least 8 characters",
              )}

              {passwordField(
                "confirmPassword",
                "Confirm password",
                showConfirmPassword,
                () => setShowConfirmPassword((value) => !value),
                errors.confirmPassword,
                "Enter your password again",
              )}

              <div>
                <label className="flex items-start gap-3 text-sm leading-6 text-[#5F5263]">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 accent-[#8F668F]"
                  />

                  <span>
                    I agree to the Terms of Service and Privacy Policy.
                  </span>
                </label>

                {errors.terms && (
                  <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#80558F] px-5 py-3.5 font-bold text-white shadow-lg shadow-[#A47BB4]/20 transition hover:-translate-y-0.5 hover:bg-[#8F668F] disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account →"}
              </button>
            </form>

            <p className="mt-6 border-t border-[#E8DDE7] pt-5 text-center text-sm text-[#5F5263]">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-bold text-[#72547D] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
