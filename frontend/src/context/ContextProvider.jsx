import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import AuthContext from "./AuthContext";

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(
    () => !localStorage.getItem("token"),
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  const login = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", nextTheme);
      return nextTheme;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("You’re signed out.");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("light-theme", theme === "light");
  }, [theme]);

  useEffect(() => {
    let isCurrent = true;

    const verifyUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const { data } = await api.get("/auth/verify");
        if (isCurrent && data.success) {
          setUser(data.user);
        }
      } catch {
        localStorage.removeItem("token");
        if (isCurrent) {
          setUser(null);
        }
      } finally {
        if (isCurrent) {
          setAuthReady(true);
        }
      }
    };

    verifyUser();
    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, authReady, login, handleLogout, theme, toggleTheme }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default ContextProvider;
