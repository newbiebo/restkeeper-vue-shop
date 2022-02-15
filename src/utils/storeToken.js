const TokenKey = 'storeToken';

export function getStoreToken() {
  return window.localStorage.getItem(TokenKey);
}

export function setStoreToken(token) {
  return window.localStorage.setItem(TokenKey, token);
}

export function removeStoreToken() {
  return window.localStorage.removeItem(TokenKey)
}
