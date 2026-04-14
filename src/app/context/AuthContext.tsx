import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Role = "user" | "admin" | null;

interface AuthContextType {
  isAuthenticated: boolean;
  role: Role;
  isInitialized: boolean;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<Role>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedRole = localStorage.getItem("userRole") as Role;

    if (storedAuth === "true" && storedRole) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }
    setIsInitialized(true);
  }, []);

  const login = (newRole: Role) => {
    setIsAuthenticated(true);
    setRole(newRole);
    localStorage.setItem("isAuthenticated", "true");
    if (newRole) {
      localStorage.setItem("userRole", newRole);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
  };

  if (!isInitialized) return null; // Or a loading spinner

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, isInitialized, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
