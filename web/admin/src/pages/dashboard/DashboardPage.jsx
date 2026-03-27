import { usePageTitle } from "../../hooks/usePageTitle";

const stats = [
  { label: "Daily revenue", value: "$4,280" },
  { label: "Orders today", value: "126" },
  { label: "Pending shipments", value: "18" },
  { label: "New customers", value: "37" }
];

export function DashboardPage() {
  usePageTitle("Dashboard");

  return (
    <section className="page-grid">
      <div className="hero-card">
        <p className="eyebrow">Overview</p>
        <h2>Admin panel is wired and ready for feature work.</h2>
        <p className="muted-text">
          Add product management, analytics, moderation, or permissions here.
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((item) => (
          <article className="stat-card" key={item.label}>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
