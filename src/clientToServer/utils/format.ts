export function formatDateTime(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
