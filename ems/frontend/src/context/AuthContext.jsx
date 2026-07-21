import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("ems_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ems_token");
    if (!token) {
      setLoading(false);
      return;
    }
    client
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("ems_user", JSON.stringify(res.data.user));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password, portal) {
    const res = await client.post("/auth/login", { email, password, portal });
    localStorage.setItem("ems_token", res.data.token);
    localStorage.setItem("ems_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  }

  function logout() {
    localStorage.removeItem("ems_token");
    localStorage.removeItem("ems_user");
    setUser(null);
  }

  function updateUser(u) {
    setUser(u);
    localStorage.setItem("ems_user", JSON.stringify(u));
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
