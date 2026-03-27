import { useLocation } from "react-router-dom";
import { getPageLabel } from "../../utils/nav";

export function Header() {
  const location = useLocation();

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Admin panel</p>
        <h1>{getPageLabel(location.pathname)}</h1>
      </div>
      <div className="topbar-card">
        <span className="status-dot" />
        <span>Ready for development</span>
      </div>
    </header>
  );
}
