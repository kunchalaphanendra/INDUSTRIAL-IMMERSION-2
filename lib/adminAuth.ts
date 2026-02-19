
export const ADMIN_EMAIL = "admin@stjufends.com";
export const ADMIN_PASSWORD = "stjufends2026";

export const loginAdmin = (email: string, password: string) => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem("admin_session", "true");
    return true;
  }
  return false;
};

export const isAdminLoggedIn = () => {
  return localStorage.getItem("admin_session") === "true";
};

export const logoutAdmin = () => {
  localStorage.removeItem("admin_session");
};
