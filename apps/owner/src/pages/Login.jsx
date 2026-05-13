import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company_code: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.company_code.trim() || !form.phone.trim() || !form.password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const data = await login(form);
      localStorage.setItem("token", data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Invalid credentials. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14
            bg-blue-600 rounded-2xl shadow-lg mb-4"
          >
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Owner Portal</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to manage your store
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-600
              text-sm px-4 py-3 rounded-xl"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Code */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Company Code
              </label>
              <input
                type="text"
                placeholder="enter ur company code"
                value={form.company_code}
                onChange={(e) => set("company_code", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5
                  text-sm outline-none focus:border-blue-400 focus:ring-2
                  focus:ring-blue-50 transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter phoneNumber"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5
                  text-sm outline-none focus:border-blue-400 focus:ring-2
                  focus:ring-blue-50 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5
                    pr-10 text-sm outline-none focus:border-blue-400 focus:ring-2
                    focus:ring-blue-50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-gray-600 transition"
                >
                  {show ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478
                        0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3
                        3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88
                        9.88L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0
                        8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542
                        7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-xl py-2.5
                text-sm font-medium hover:bg-blue-700 active:scale-[0.98]
                transition-all duration-150 disabled:opacity-60
                disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
