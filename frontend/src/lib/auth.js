const AUTH_KEY = "bis_filling_auth";

/**
 * Stores authentication data (token and user object) in localStorage.
 * @param {object} authData - The authentication data to store.
 */
export const setAuth = (authData) => {
  if (!authData) return;
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  } catch (e) {
    console.error("Could not save auth data to localStorage", e);
  }
};

/**
 * Retrieves authentication data from localStorage.
 * @returns {object|null} The stored auth data or null if not found.
 */
export const getAuth = () => {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Could not retrieve auth data from localStorage", e);
    return null;
  }
};

/**
 * Removes authentication data from localStorage.
 */
export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem("authUser"); // Legacy key
  localStorage.removeItem("token"); // Legacy key
  localStorage.removeItem("user"); // Legacy key
};