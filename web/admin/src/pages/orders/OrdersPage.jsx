import { usePageTitle } from "../../hooks/usePageTitle";

export function OrdersPage() {
  usePageTitle("Orders");

  return (
    <section className="stack">
      <div className="section-card">
        <h2>Orders</h2>
        <p className="muted-text">
          Use this area for order pipeline status, delivery updates, and refund
          workflows.
        </p>
      </div>
    </section>
  );
}
