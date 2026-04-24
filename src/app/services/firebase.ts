import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  Auth,
} from "firebase/auth";

// ─── Detect if credentials are still placeholders ────────────────────────────
const RAW = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            ?? "",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        ?? "",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         ?? "",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             ?? "",
};

// A key is "configured" when it's set AND is not the placeholder string
const isConfigured = (v: string) =>
  v.length > 0 && !v.startsWith("YOUR_");

export const FIREBASE_READY =
  isConfigured(RAW.apiKey) &&
  isConfigured(RAW.authDomain) &&
  isConfigured(RAW.projectId) &&
  isConfigured(RAW.appId);

// ─── Verbose dev-time diagnostics ────────────────────────────────────────────
if (!FIREBASE_READY) {
  console.error(
    "%c[Firebase] NOT configured — auth will not work!",
    "color:#ff6b6b;font-weight:bold;font-size:14px"
  );
  console.error(
    "Open  .env.local  and replace every YOUR_* value with your real Firebase SDK credentials.\n" +
    "Get them from: Firebase Console → Project Settings → General → Your Apps → SDK config\n\n" +
    "Current values:\n" +
    Object.entries(RAW)
      .map(([k, v]) => `  ${k}: ${v || "(empty)"}`)
      .join("\n")
  );
} else {
  console.info("[Firebase] Config loaded ✓  project:", RAW.projectId);
}

// ─── Initialize Firebase (only when credentials look valid) ──────────────────
let app: FirebaseApp | null = null;
let auth: Auth;
let googleProvider: GoogleAuthProvider;

if (FIREBASE_READY) {
  app = getApps().length === 0 ? initializeApp(RAW) : getApp();
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });
} else {
  // Stubs — the app will show the ConfigError screen instead of crashing
  // @ts-expect-error intentional stub when not configured
  auth = null;
  // @ts-expect-error intentional stub when not configured
  googleProvider = null;
}

export { auth, googleProvider };

// ─── Invisible reCAPTCHA verifier for Phone Auth ─────────────────────────────
/**
 * Creates (or re-creates) an invisible reCAPTCHA verifier bound to the
 * element with id="recaptcha-container".
 *
 * Must be called AFTER the element is in the DOM.
 * Clears any previous instance to prevent "already rendered" errors.
 */
export function createRecaptchaVerifier(): RecaptchaVerifier {
  if (!FIREBASE_READY || !auth) {
    throw new Error("Firebase is not configured. Fill in .env.local first.");
  }

  if ((window as any)._recaptchaVerifier) {
    try {
      (window as any)._recaptchaVerifier.clear();
    } catch (_) {
      // Ignore — element may have been removed from DOM
    }
    (window as any)._recaptchaVerifier = null;
  }

  const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved — Firebase sends SMS automatically
    },
    "expired-callback": () => {
      console.warn("[reCAPTCHA] Token expired — user must request code again.");
    },
  });

  (window as any)._recaptchaVerifier = verifier;
  return verifier;
}
