export function hasCredentials(url: URL): boolean {
  if (url.username || url.password) {
    return true;
  }
  return false;
}
