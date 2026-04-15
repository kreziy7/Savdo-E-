import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const auth = await login({ email: form.email, password: form.password });
      const role = auth?.profile?.role?.toUpperCase();
      if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
        throw new Error("Ruxsat yo'q: Admin yoki Super Admin roli talab qilinadi");
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Login amalga oshmadi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--app-bg)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-xl p-8"
        style={{ background: "var(--card-bg)", color: "var(--text-primary)" }}
      >
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11m6 0c0-1.657 1.343-3 3-3s3 1.343 3 3m-6 0v5m0-5H9m3 0h3" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Savdo Admin</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Admin paneliga kirish
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              style={{
                background: "var(--input-bg, #f9fafb)",
                borderColor: "var(--border-color, #e5e7eb)",
                color: "var(--text-primary)",
              }}
              placeholder="admin@savdo.uz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
              Parol
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              style={{
                background: "var(--input-bg, #f9fafb)",
                borderColor: "var(--border-color, #e5e7eb)",
                color: "var(--text-primary)",
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm transition-colors disabled:opacity-60"
          >
            {loading ? "Kirish..." : "Kirish"}
          </button>
        </form>
      </div>
    </div>
  );
}
