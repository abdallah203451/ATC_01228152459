import React, { createContext, useState, useEffect, useContext } from "react";
import { User } from "@/services/api";
import { api } from "@/services/api";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isLoading: false,
  isAdmin: false,
  forgotPassword: async () => {},
  resetPassword: async () => {},
});

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if we have a saved token in localStorage on component mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // In a real app, we would validate the token with the server
          // For now, we'll just set the user from localStorage if available
          const userData = localStorage.getItem("user");
          if (userData) {
            const parsedUser = JSON.parse(userData) as User;
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // If we have a token but no user data, clear everything
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
          }
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      }

      // Add mock auth data for demo purposes if we're using mock API
      if (
        import.meta.env.DEV &&
        import.meta.env.VITE_USE_MOCK_API === "true" &&
        !token
      ) {
        console.log("🔑 Using mock authentication for demo");
        console.log("Admin login: admin@example.com / password");
        console.log("User login: user@example.com / password");
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.auth.login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.auth.register(name, email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Store email for reset password flow
      localStorage.setItem("resetPasswordEmail", email);
      await api.auth.forgotPassword(email);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setIsLoading(true);
    try {
      await api.auth.resetPassword(token, password);
      // Clean up stored email after successful reset
      localStorage.removeItem("resetPasswordEmail");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call backend to invalidate token
      await api.auth.logout();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear local storage regardless of server response
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Determine if user is an admin
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        isLoading,
        isAdmin,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
