import { useEffect } from "react";
import { appConfig } from "../config/appConfig";

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} | ${appConfig.appName}`
      : appConfig.appName;
  }, [title]);
}
