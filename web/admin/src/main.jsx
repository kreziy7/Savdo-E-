import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { I18nProvider } from "./i18n";
import { AdminDataProvider } from "./store/adminData";
import { AuthProvider } from "./store";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nProvider>
      <AuthProvider>
        <AdminDataProvider>
          <App />
        </AdminDataProvider>
      </AuthProvider>
    </I18nProvider>
  </React.StrictMode>
);
