/**
 * Tests whether localStorage is available and writeable. This is of particular
 * use for addressing errors that arise in mobile Safari in private mode where
 * localStorage exists, but has a max size of 0 setting any items in it results
 * in a "QuotaExceededError".
 * @return {Boolean}
 */
function isLocalStorageSupported() {
  if (process.server || !('localStorage' in window)) {
    return false
  }
  try {
    const x = 'testStorage'
    localStorage.setItem(x, x)
    localStorage.removeItem(x)
    return true
  } catch (e) {
    return false
  }
}

export default isLocalStorageSupported
