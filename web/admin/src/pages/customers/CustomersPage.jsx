import { usePageTitle } from "../../hooks/usePageTitle";

export function CustomersPage() {
  usePageTitle("Customers");

  return (
    <section className="stack">
      <div className="section-card">
        <h2>Customers</h2>
        <p className="muted-text">
          Customer search, moderation notes, loyalty status, and segmentation
          can be added here.
        </p>
      </div>
    </section>
  );
}
