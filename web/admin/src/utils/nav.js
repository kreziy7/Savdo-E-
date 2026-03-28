const pageMeta = [
  { path: "/dashboard", key: "dashboard", labelKey: "dashboard" },
  { path: "/users", key: "users", labelKey: "users" },
  { path: "/admins", key: "admins", labelKey: "admins" },
  { path: "/roles", key: "roles", labelKey: "roles" },
  { path: "/permissions", key: "permissions", labelKey: "permissions" },
  { path: "/content", key: "content", labelKey: "content" },
  { path: "/reports", key: "reports", labelKey: "reports" },
  { path: "/audit-logs", key: "auditLogs", labelKey: "auditLogs" },
  { path: "/settings", key: "settings", labelKey: "settings" },
  { path: "/profile", key: "profile", labelKey: "profile" },
  { path: "/login", key: "login", labelKey: "login" }
];

function resolveMeta(key, labelKey, t) {
  return {
    title:
      key === "login"
        ? t("auth.signIn")
        : t(`navigation.menu.${labelKey}.label`, {}, t(`navigation.pageMeta.${key}.title`)),
    eyebrow: t(`navigation.pageMeta.${key}.eyebrow`),
    description: t(`navigation.pageMeta.${key}.description`)
  };
}

export function getPageMeta(pathname, t) {
  const directMatch = pageMeta.find((item) => item.path === pathname);

  if (directMatch) {
    return resolveMeta(directMatch.key, directMatch.labelKey, t);
  }

  if (pathname.startsWith("/users/")) {
    return {
      title: t("navigation.pageMeta.userDetail.title"),
      eyebrow: t("navigation.pageMeta.userDetail.eyebrow"),
      description: t("navigation.pageMeta.userDetail.description")
    };
  }

  return {
    title: t("navigation.pageMeta.fallback.title"),
    eyebrow: t("navigation.pageMeta.fallback.eyebrow"),
    description: t("navigation.pageMeta.fallback.description")
  };
}

export function getPageLabel(pathname, t) {
  return getPageMeta(pathname, t).title;
}

export function getBreadcrumbs(pathname, t) {
  const segments = pathname.split("/").filter(Boolean);

  if (!segments.length) {
    return [{ label: t("navigation.breadcrumbs.dashboard"), path: "/dashboard" }];
  }

  const breadcrumbs = [
    { label: t("navigation.breadcrumbs.dashboard"), path: "/dashboard" }
  ];
  let currentPath = "";

  segments.forEach((segment) => {
    currentPath += `/${segment}`;

    if (segment === "dashboard") {
      return;
    }

    if (segment.match(/^USR-/i) || pathname.startsWith("/users/")) {
      breadcrumbs.push({ label: t("navigation.breadcrumbs.users"), path: "/users" });
      breadcrumbs.push({
        label: t("navigation.breadcrumbs.userDetail"),
        path: pathname
      });
      return;
    }

    const meta = getPageMeta(currentPath, t);
    breadcrumbs.push({ label: meta.title, path: currentPath });
  });

  return breadcrumbs.filter(
    (item, index, array) =>
      array.findIndex((candidate) => candidate.path === item.path) === index
  );
}
