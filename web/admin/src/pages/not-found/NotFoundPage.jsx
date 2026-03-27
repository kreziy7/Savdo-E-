import { Link } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

export function NotFoundPage() {
  usePageTitle("Not Found");

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="muted-text">
          The route does not exist yet. Go back to the dashboard.
        </p>
        <Link className="inline-link" to="/dashboard">
          Open dashboard
        </Link>
      </div>
    </section>
  );
}
