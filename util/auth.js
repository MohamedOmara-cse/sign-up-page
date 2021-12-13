import Cookies from 'js-cookie'
import isLocalStorageSupported from './isLocalStorageSupported'

const TOKEN_NAME = 'auth_token'

export const setToken = (token) => {
  if (process.server) return
  if (isLocalStorageSupported()) {
    window.localStorage.setItem(TOKEN_NAME, token)
  } else {
    Cookies.set(TOKEN_NAME, token)
  }
}

export const unsetToken = () => {
  if (process.server) return
  if (isLocalStorageSupported()) {
    window.localStorage.removeItem(TOKEN_NAME)
  } else {
    Cookies.remove(TOKEN_NAME)
  }
}

export const getToken = () => {
  return isLocalStorageSupported()
    ? window.localStorage.getItem(TOKEN_NAME)
    : Cookies.get(TOKEN_NAME)
}
