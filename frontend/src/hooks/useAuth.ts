import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useRequireAuth() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return { token, isAuthenticated: !!token };
}

export function useAuth() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  return {
    token,
    username,
    isAuthenticated: !!token,
  };
}

export function useLogout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return logout;
}