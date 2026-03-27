import { usePageTitle } from "../../hooks/usePageTitle";

export function SettingsPage() {
  usePageTitle("Settings");

  return (
    <section className="stack">
      <div className="section-card">
        <h2>Settings</h2>
        <p className="muted-text">
          Global configuration, roles, environment toggles, and integrations
          can be managed here.
        </p>
      </div>
    </section>
  );
}
