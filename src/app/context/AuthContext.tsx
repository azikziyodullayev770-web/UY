import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, googleProvider } from "../services/firebase";
import { signInWithPopup, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

export type Role = "user" | "superadmin" | "admin" | "moderator" | null;

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  role: Role;
}

interface AuthContextType {
  isAuthenticated: boolean;
  role: Role;
  user: User | null;
  isInitialized: boolean;
  sendOTP: (phoneNumber: string) => Promise<boolean>;
  verifyOTP: (phoneNumber: string, code: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin UID or emails for role assignment (Simulation)
const ADMIN_IDENTIFIERS: Record<string, Role> = {
  "admin@uyjoy.uz": "superadmin",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<Role>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const assignedRole = ADMIN_IDENTIFIERS[fbUser.email || ""] || "user";
        const userData: User = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          phoneNumber: fbUser.phoneNumber,
          photoURL: fbUser.photoURL,
          role: assignedRole,
        };
        setUser(userData);
        setRole(assignedRole);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
      }
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  const sendOTP = async (phoneNumber: string): Promise<boolean> => {
    // Basic mock for phone auth as real SMS requires site verification
    console.log(`[Phone Auth Mock] Sending OTP to ${phoneNumber}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  };

  const verifyOTP = async (_phoneNumber: string, code: string): Promise<boolean> => {
    // Still mock for phone, as real Firebase phone auth needs Recapcha/verifier
    if (code === "123456") {
      setIsAuthenticated(true);
      setRole("user");
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (e) {
      console.error("Logout Error:", e);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      return false;
    }
  };

  const login = (username: string, password: string): boolean => {
    // Admin simulation
    const admins = ["superadmin", "admin", "moderator"];
    if (admins.includes(username.toLowerCase()) && password === "222222") {
      const assignedRole = username.toLowerCase() as Role;
      setRole(assignedRole);
      setIsAuthenticated(true);
      setUser({
        uid: "admin-uid",
        email: `${username}@uyjoy.uz`,
        displayName: username.charAt(0).toUpperCase() + username.slice(1),
        phoneNumber: "+998 90 000 00 00",
        photoURL: null,
        role: assignedRole,
      });
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, user, isInitialized, sendOTP, verifyOTP, loginWithGoogle, login, logout }}>
      {isInitialized ? children : (
        <div className="flex h-screen items-center justify-center bg-slate-950 text-white font-medium">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="text-slate-400">Yuklanmoqda...</p>
          </div>
        </div>
      )}
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
