import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { FIREBASE_READY } from "../services/firebase";

// ─── Types ───────────────────────────────────────────────────────────────────

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
  phoneAuthError: string | null;
  googleAuthError: string | null;
  isSendingOTP: boolean;
  isVerifyingOTP: boolean;
  isGoogleLoading: boolean;
  isDemoMode: boolean;
  sendOTP: (phoneNumber: string) => Promise<boolean>;
  verifyOTP: (code: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  login: (username: string, password: string) => boolean;
  logout: () => Promise<void>;
  clearErrors: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Role map (add UIDs/emails → roles here) ─────────────────────────────────
const ROLE_MAP: Record<string, Role> = {
  "admin@uyjoy.uz": "superadmin",
};

// ─── Demo mode users ──────────────────────────────────────────────────────────
const DEMO_GOOGLE_USER: User = {
  uid: "demo-google-uid",
  email: "demo@gmail.com",
  displayName: "Demo Foydalanuvchi (Google)",
  phoneNumber: null,
  photoURL: null,
  role: "user",
};

// ─── Friendly Uzbek error messages ───────────────────────────────────────────
function friendlyAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";

  const MAP: Record<string, string> = {
    "auth/invalid-api-key":
      "Firebase API kaliti noto'g'ri. .env.local faylini tekshiring.",
    "auth/api-key-not-valid":
      "Firebase API kaliti noto'g'ri. .env.local faylini tekshiring.",
    "auth/popup-closed-by-user":
      "Google kirish oynasi yopildi. Qayta urinib ko'ring.",
    "auth/popup-blocked":
      "Brauzer popup ni blokladi. Iltimos, ruxsat bering.",
    "auth/cancelled-popup-request":
      "Kirish bekor qilindi. Qayta urinib ko'ring.",
    "auth/network-request-failed":
      "Internet aloqasi yo'q. Tarmoqni tekshiring.",
    "auth/too-many-requests":
      "Juda ko'p urinish. Bir oz kuting.",
    "auth/invalid-phone-number":
      "Telefon raqami noto'g'ri. +998XXXXXXXXX formatida kiriting.",
    "auth/missing-phone-number": "Telefon raqamini kiriting.",
    "auth/captcha-check-failed":
      "reCAPTCHA xatolik. Sahifani yangilang.",
    "auth/invalid-verification-code":
      "Tasdiqlash kodi noto'g'ri. Qayta tekshiring.",
    "auth/code-expired":
      "Kod muddati o'tdi. Yangi kod so'rang.",
    "auth/session-expired": "Sessiya tugadi. Yangi kod so'rang.",
    "auth/quota-exceeded":
      "SMS kvotasi tugagan. Test raqamidan foydalaning.",
    "auth/unauthorized-domain":
      "Bu domen Firebase da ruxsatlanmagan. Authorized domains ga 'localhost' qo'shing.",
  };

  if (MAP[code]) return MAP[code];
  console.error("[Auth Error]", error);
  return `Xatolik yuz berdi: ${code || String(error)}`;
}

// ─── DEMO MODE Auth (no Firebase required) ────────────────────────────────────
function useDemoAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [user, setUser] = useState<User | null>(null);
  const [phoneAuthError, setPhoneAuthError] = useState<string | null>(null);
  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Simulate realistic delays
  const sendOTP = async (phoneNumber: string): Promise<boolean> => {
    setPhoneAuthError(null);
    setIsSendingOTP(true);
    console.info(`[DEMO] SMS kodi yuborilmoqda: ${phoneNumber}`);
    await new Promise(r => setTimeout(r, 1500));
    setIsSendingOTP(false);
    console.info("[DEMO] OTP yuborildi! Kodni kiriting: 123456");
    return true;
  };

  const verifyOTP = async (code: string): Promise<boolean> => {
    setPhoneAuthError(null);
    setIsVerifyingOTP(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsVerifyingOTP(false);

    if (code === "123456") {
      const phoneUser: User = {
        uid: "demo-phone-uid",
        email: null,
        displayName: "Telefon Foydalanuvchisi (Demo)",
        phoneNumber: "+998901234567",
        photoURL: null,
        role: "user",
      };
      setUser(phoneUser);
      setRole("user");
      setIsAuthenticated(true);
      return true;
    }
    setPhoneAuthError("Noto'g'ri kod. Demo rejimda: 123456 kiriting.");
    return false;
  };

  const registerWithEmail = async (email: string, _password: string, name: string): Promise<boolean> => {
    setIsGoogleLoading(true); // Reusing loading state for simplicity
    await new Promise(r => setTimeout(r, 1500));
    setIsGoogleLoading(false);
    setUser({
      uid: `demo-email-${Date.now()}`,
      email,
      displayName: name,
      phoneNumber: null,
      photoURL: null,
      role: "user",
    });
    setRole("user");
    setIsAuthenticated(true);
    return true;
  };

  const loginWithEmail = async (email: string, _password: string): Promise<boolean> => {
    setIsGoogleLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsGoogleLoading(false);
    setUser({
      uid: `demo-email-login`,
      email,
      displayName: email.split("@")[0],
      phoneNumber: null,
      photoURL: null,
      role: "user",
    });
    setRole("user");
    setIsAuthenticated(true);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setGoogleAuthError(null);
    setIsGoogleLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsGoogleLoading(false);
    setUser(DEMO_GOOGLE_USER);
    setRole("user");
    setIsAuthenticated(true);
    console.info("[DEMO] Google login muvaffaqiyatli!");
    return true;
  };

  const login = (username: string, password: string): boolean => {
    const admins = ["superadmin", "admin", "moderator"];
    if (admins.includes(username.toLowerCase()) && password === "222222") {
      const assignedRole = username.toLowerCase() as Role;
      setRole(assignedRole);
      setIsAuthenticated(true);
      setUser({
        uid: `admin-${username}`,
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

  const logout = async () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  const clearErrors = () => {
    setPhoneAuthError(null);
    setGoogleAuthError(null);
  };

  return {
    isAuthenticated, role, user,
    isInitialized: true,
    isDemoMode: true,
    phoneAuthError, googleAuthError,
    isSendingOTP, isVerifyingOTP, isGoogleLoading,
    sendOTP, verifyOTP, loginWithGoogle, registerWithEmail, loginWithEmail, login, logout, clearErrors,
  };
}

// ─── REAL Firebase Auth ────────────────────────────────────────────────────────
function useFirebaseAuth() {
  // Lazy import Firebase modules — only loaded when FIREBASE_READY is true
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [phoneAuthError, setPhoneAuthError] = useState<string | null>(null);
  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Holds the Firebase ConfirmationResult while waiting for OTP entry
  const confirmationRef = useRef<import("firebase/auth").ConfirmationResult | null>(null);

  // Dynamic imports keep bundle split clean
  const getFirebase = async () => {
    const [
      { auth, googleProvider, createRecaptchaVerifier },
      {
        signInWithPopup, signInWithRedirect, getRedirectResult,
        signInWithPhoneNumber, onAuthStateChanged,
      },
    ] = await Promise.all([
      import("../services/firebase"),
      import("firebase/auth"),
    ]);
    return { auth, googleProvider, createRecaptchaVerifier, signInWithPopup, signInWithRedirect, getRedirectResult, signInWithPhoneNumber, onAuthStateChanged };
  };

  // Auth state listener
  useEffect(() => {
    let unsubscribe = () => {};
    getFirebase().then(({ auth, onAuthStateChanged }) => {
      unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const assignedRole = ROLE_MAP[fbUser.email ?? ""] ?? "user";
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            phoneNumber: fbUser.phoneNumber,
            photoURL: fbUser.photoURL,
            role: assignedRole,
          });
          setRole(assignedRole);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setRole(null);
          setIsAuthenticated(false);
        }
        setIsInitialized(true);
      });
    });
    return () => unsubscribe();
  }, []);

  // Handle Google redirect result on page load
  useEffect(() => {
    getFirebase().then(({ auth, getRedirectResult }) => {
      getRedirectResult(auth).catch((e: unknown) => {
        setGoogleAuthError(friendlyAuthError(e));
      });
    });
  }, []);

  const clearErrors = () => {
    setPhoneAuthError(null);
    setGoogleAuthError(null);
  };

  const sendOTP = async (phoneNumber: string): Promise<boolean> => {
    setPhoneAuthError(null);
    setIsSendingOTP(true);
    confirmationRef.current = null;
    try {
      const { auth, createRecaptchaVerifier, signInWithPhoneNumber } = await getFirebase();
      const verifier = createRecaptchaVerifier();
      await verifier.render();
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      confirmationRef.current = confirmation;
      return true;
    } catch (e) {
      setPhoneAuthError(friendlyAuthError(e));
      return false;
    } finally {
      setIsSendingOTP(false);
    }
  };

  const verifyOTP = async (code: string): Promise<boolean> => {
    setPhoneAuthError(null);
    if (!confirmationRef.current) {
      setPhoneAuthError("Avval telefon raqamingizni kiriting va kod so'rang.");
      return false;
    }
    setIsVerifyingOTP(true);
    try {
      await confirmationRef.current.confirm(code);
      return true;
    } catch (e) {
      setPhoneAuthError(friendlyAuthError(e));
      return false;
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setGoogleAuthError(null);
    setIsGoogleLoading(true);
    try {
      const { auth, googleProvider, signInWithPopup } = await getFirebase();
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (e) {
      const code = (e as { code?: string })?.code ?? "";
      if (["auth/popup-blocked", "auth/popup-closed-by-user", "auth/cancelled-popup-request"].includes(code)) {
        try {
          const { auth, googleProvider, signInWithRedirect } = await getFirebase();
          await signInWithRedirect(auth, googleProvider);
          return true;
        } catch (re) {
          setGoogleAuthError(friendlyAuthError(re));
          return false;
        }
      }
      setGoogleAuthError(friendlyAuthError(e));
      return false;
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const login = (username: string, password: string): boolean => {
    const admins = ["superadmin", "admin", "moderator"];
    if (admins.includes(username.toLowerCase()) && password === "222222") {
      const assignedRole = username.toLowerCase() as Role;
      setRole(assignedRole);
      setIsAuthenticated(true);
      setUser({
        uid: `admin-${username}`,
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

  const registerWithEmail = async (email: string, password: string, name: string): Promise<boolean> => {
    setGoogleAuthError(null);
    setIsGoogleLoading(true);
    try {
      const { auth } = await getFirebase();
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      return true;
    } catch (e) {
      setGoogleAuthError(friendlyAuthError(e));
      return false;
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    setGoogleAuthError(null);
    setIsGoogleLoading(true);
    try {
      const { auth } = await getFirebase();
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (e) {
      setGoogleAuthError(friendlyAuthError(e));
      return false;
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { auth } = await getFirebase();
      await auth.signOut();
    } catch (e) {
      console.error("[Auth] signOut error:", e);
    }
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated, role, user, isInitialized,
    isDemoMode: false,
    phoneAuthError, googleAuthError,
    isSendingOTP, isVerifyingOTP, isGoogleLoading,
    sendOTP, verifyOTP, loginWithGoogle, registerWithEmail, loginWithEmail, login, logout, clearErrors,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  // Automatically use Demo or Firebase depending on whether credentials exist
  const demo = useDemoAuth();
  const firebase = useFirebaseAuth();
  const ctx = FIREBASE_READY ? firebase : demo;

  return (
    <AuthContext.Provider value={ctx}>
      {ctx.isInitialized ? (
        children
      ) : (
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm font-medium">Yuklanmoqda…</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
