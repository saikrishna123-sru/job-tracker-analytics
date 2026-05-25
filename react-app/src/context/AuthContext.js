import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getStoredToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const [isAuth, setIsAuth] = useState(getStoredToken() ? true : false);

  // LOGIN
  const login = (token, email, rememberMe = true) => {
    if (rememberMe) {
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", email);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userEmail");
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userEmail", email);
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
    }

    setIsAuth(true);

    window.location.href = "/";
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userEmail");

    setIsAuth(false);

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
