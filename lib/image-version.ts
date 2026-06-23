export function withImageVersion(
  url?: string | null,
  version?: string | Date | null
) {
  if (!url) return null;
  if (!version) return url;

  const separator = url.includes("?") ? "&" : "?";
  const value =
    version instanceof Date
      ? version.getTime()
      : encodeURIComponent(String(version));

  return `${url}${separator}v=${value}`;
}

