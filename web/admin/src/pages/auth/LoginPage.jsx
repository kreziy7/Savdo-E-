import { usePageTitle } from "../../hooks/usePageTitle";

export function LoginPage() {
  usePageTitle("Login");

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Authentication</p>
        <h1>Admin sign in</h1>
        <p className="muted-text">
          Connect your real auth flow here when backend endpoints are ready.
        </p>
        <form className="auth-form">
          <label>
            Email
            <input type="email" placeholder="admin@example.com" />
          </label>
          <label>
            Password
            <input type="password" placeholder="Enter password" />
          </label>
          <button type="button">Continue</button>
        </form>
      </div>
    </section>
  );
}
