// Small cookie helper: set, get, delete
export function setCookie(name, value, days = 7) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
}

export function getCookie(name) {
  const key = name + "=";
  const decoded = decodeURIComponent(document.cookie || "");
  const parts = decoded.split(';');
  for (let i = 0; i < parts.length; i++) {
    let c = parts[i].trim();
    if (c.indexOf(key) === 0) return c.substring(key.length, c.length);
  }
  return null;
}

export function deleteCookie(name) {
  // set cookie expiry in the past
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
