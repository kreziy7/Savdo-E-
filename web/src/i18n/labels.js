export function getRoleLabel(t, role) {
  return t(`labels.roles.${role}`, {}, role);
}

export function getStatusLabel(t, status) {
  return t(`labels.statuses.${status}`, {}, status);
}

export function getModuleLabel(t, moduleName) {
  return t(`labels.modules.${moduleName}`, {}, moduleName);
}

export function getActionLabel(t, actionName) {
  return t(`labels.actions.${actionName}`, {}, actionName);
}

export function getPriorityLabel(t, priority) {
  return t(`labels.priorities.${priority}`, {}, priority);
}

export function getContentTypeLabel(t, type) {
  return t(`labels.contentTypes.${type}`, {}, type);
}

export function getPermissionSummaryLabel(t, summaryKey) {
  return t(`labels.permissionSummaries.${summaryKey}`, {}, summaryKey);
}

export function getCreatedByLabel(t, createdBy) {
  if (!createdBy) {
    return "";
  }

  if (typeof createdBy === "string") {
    return createdBy;
  }

  if (createdBy.type === "system") {
    return t("labels.createdBy.system");
  }

  return createdBy.name || "";
}

export function formatRelativeTime(t, value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  switch (value.type) {
    case "just_now":
      return t("time.justNow");
    case "minutes_ago":
      return t("time.minutesAgo", { count: value.count });
    case "pending_invite":
      return t("time.pendingInvite");
    case "today_at":
      return t("time.todayAt", { time: value.time });
    case "never":
      return t("time.never");
    default:
      return value.label || "";
  }
}

export function resolveText(t, entry, keyName, valueName) {
  if (entry?.[keyName]) {
    return t(entry[keyName]);
  }

  return entry?.[valueName] || "";
}
