import { usePageTitle } from "../../hooks/usePageTitle";

export function ProductsPage() {
  usePageTitle("Products");

  return (
    <section className="stack">
      <div className="section-card">
        <h2>Products</h2>
        <p className="muted-text">
          Product list, category management, stock controls, and bulk actions
          can be implemented in this module.
        </p>
      </div>
    </section>
  );
}
