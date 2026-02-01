"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { authService, userService } from "@/services/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const profile = await userService.getProfile();
          if (profile.success) {
            setUser(profile.data);
          } else {
            // Token might be invalid
            Cookies.remove("token");
            setUser(null);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          Cookies.remove("token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      if (data.success) {
        const { token, user } = data.data;
        Cookies.set("token", token, { expires: 7 }); // Store token for 7 days
        setUser(user);
        toast.success("تم تسجيل الدخول بنجاح");

        // Handle redirection
        const searchParams = new URLSearchParams(window.location.search);
        const returnUrl = searchParams.get("returnUrl");

        if (returnUrl) {
          router.push(returnUrl);
        } else {
          router.push("/");
        }
        return true;
      }
    } catch (error) {
      console.error("Login error:", error);
      const msg = error.response?.data?.message || "فشل تسجيل الدخول";
      toast.error(msg);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (data.success) {
        toast.success("تم إنشاء الحساب بنجاح. يرجى تسجيل الدخول.");
        router.push("/auth/login");
        return true;
      }
    } catch (error) {
      console.error("Register error:", error);
      const msg = error.response?.data?.message || "فشل إنشاء الحساب";
      toast.error(msg);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      Cookies.remove("token");
      setUser(null);
      router.push("/");
      toast.success("تم تسجيل الخروج بنجاح");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
