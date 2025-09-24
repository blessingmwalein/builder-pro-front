const TOKEN_COOKIE = 'upm_token';
const TOKEN_MAX_AGE_DAYS = 30;

export function setTokenCookie(token: string) {
  if (typeof document === 'undefined') return;
  const maxAge = TOKEN_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Max-Age=${maxAge}; Path=/`;
}

export function getTokenCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + TOKEN_COOKIE + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearTokenCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_COOKIE}=; Max-Age=0; Path=/`;
}


