import { motion, AnimatePresence } from "motion/react";
import { GlassCard } from "../components/GlassCard";
import {
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Loader2,
  X,
  Globe,
  AlertCircle,
  FlaskConical,
  Mail,
  Lock,
  User
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";
import { FIREBASE_READY } from "../services/firebase";

import logo from "../assets/logo.png";

interface LoginScreenProps {
  onLogin: () => void;
  onSkip?: () => void;
}

type LoginStep = "phone" | "otp" | "email-login" | "email-register";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.1c-.22-.67-.35-1.39-.35-2.1s.13-1.43.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

const ErrorBanner = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3"
  >
    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
    <p className="text-red-400 text-xs font-medium leading-relaxed">{message}</p>
  </motion.div>
);

export function LoginScreen({ onLogin, onSkip }: LoginScreenProps) {
  const {
    sendOTP,
    verifyOTP,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    phoneAuthError,
    googleAuthError,
    isSendingOTP,
    isVerifyingOTP,
    isGoogleLoading,
    clearErrors,
    isAuthenticated,
  } = useAuth();

  const { t } = useTranslation();

  const [step, setStep] = useState<LoginStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  
  // Email states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  useEffect(() => {
    if (isAuthenticated) {
      onLogin();
    }
  }, [isAuthenticated, onLogin]);

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    let result = "";
    if (digits.length > 0) result += digits.slice(0, 2);
    if (digits.length > 2) result += " " + digits.slice(2, 5);
    if (digits.length > 5) result += " " + digits.slice(5, 7);
    if (digits.length > 7) result += " " + digits.slice(7, 9);
    return result;
  };

  const isPhoneValid = phoneNumber.replace(/\s/g, "").length === 9;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(formatPhoneNumber(e.target.value));
    clearErrors();
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid) return;

    const fullPhone = `+998${phoneNumber.replace(/\s/g, "")}`;
    const success = await sendOTP(fullPhone);
    if (success) {
      setOtp("");
      setStep("otp");
      setResendCountdown(60);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;

    const success = await verifyOTP(otp);
    if (success) {
      onLogin();
    } else {
      setOtp("");
    }
  };

  const handleGoogleLogin = async () => {
    clearErrors();
    const success = await loginWithGoogle();
    if (success && !isGoogleLoading) {
      onLogin();
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    if (!email.includes("@")) {
      setEmailError(t("login.invalidEmail"));
      return;
    }
    if (password.length < 6) {
      setEmailError(t("login.passwordTooShort"));
      return;
    }
    const success = await loginWithEmail(email, password);
    if (success) onLogin();
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    if (!email.includes("@")) {
      setEmailError(t("login.invalidEmail"));
      return;
    }
    if (password.length < 6) {
      setEmailError(t("login.passwordTooShort"));
      return;
    }
    if (!name) {
      setEmailError("Ismingizni kiriting");
      return;
    }
    const success = await registerWithEmail(email, password, name);
    if (success) onLogin();
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp("");
    clearErrors();
    setEmailError(null);
  };

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center bg-background px-6 py-12 overflow-y-auto">
      <div id="recaptcha-container" />

      {!FIREBASE_READY && (
        <motion.div 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-amber-500/10 border-b border-amber-500/30 px-4 py-3 flex items-center justify-center gap-3 backdrop-blur-md"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-amber-200 text-[10px] font-black uppercase tracking-widest leading-tight">
            DEMO REJIM <span className="text-foreground opacity-40 mx-2">|</span> OTP: <span className="text-foreground">123456</span> 
            <br />
            <span className="text-amber-400">Admin: admin@gmail.com / admin777 | Mod: moderator@gmail.com / moderator777</span>
          </p>
        </motion.div>
      )}

      {/* Background decor */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[30%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10 flex flex-col items-center justify-center flex-grow"
      >
        {/* Header */}
        <div className="text-center mb-8 relative w-full">
          {onSkip && (
            <button
              onClick={onSkip}
              className="absolute -top-4 right-0 p-2 rounded-full bg-black/5 dark:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-black/5 dark:bg-white/5 overflow-hidden border border-black/10 dark:border-white/10 shadow-lg mb-6 p-4"
          >
            <img src={logo} alt="UY JOY Logo" className="w-full h-full object-contain" />
          </motion.div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2 uppercase">
            {t("home.title")}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">{t("login.slogan")}</p>
        </div>

        {/* Card */}
        <GlassCard className="w-full overflow-hidden border-black/10 dark:border-white/10">
          <div className="p-8 relative">
            <AnimatePresence mode="wait">
              {/* --- PHONE STEP --- */}
              {step === "phone" && (
                <motion.div
                  key="phone-step"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-black text-foreground">{t("login.welcome")}</h2>
                    <p className="text-muted-foreground text-sm px-4">{t("login.message")}</p>
                  </div>

                  <form onSubmit={handleSendCode} className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                        {t("login.phone")}
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center gap-2 pr-3 border-r border-black/10 dark:border-white/10 group-focus-within:border-cyan-500/50 transition-colors">
                          <Globe className="w-4 h-4 text-cyan-500" />
                          <span className="text-foreground font-bold">+998</span>
                        </div>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          placeholder="90 123 45 67"
                          className="w-full h-16 pl-28 pr-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground text-xl font-bold outline-none transition-all focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 placeholder:text-foreground/10"
                          autoFocus
                        />
                      </div>
                    </div>

                    <AnimatePresence>
                      {phoneAuthError && <ErrorBanner message={phoneAuthError} />}
                    </AnimatePresence>

                    <button
                      type="submit"
                      disabled={isSendingOTP || !isPhoneValid}
                      className="w-full h-16 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-card disabled:text-slate-600 text-slate-950 font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/10 active:scale-[0.98]"
                    >
                      {isSendingOTP ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t("common.confirm")}<ArrowRight className="w-5 h-5" /></>}
                    </button>
                  </form>

                  <div className="relative py-4 flex items-center">
                    <div className="flex-grow border-t border-black/5 dark:border-white/5" />
                    <span className="flex-shrink mx-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                      {t("login.or")}
                    </span>
                    <div className="flex-grow border-t border-black/5 dark:border-white/5" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleGoogleLogin}
                      disabled={isGoogleLoading}
                      className="h-16 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-white/10 text-foreground flex items-center justify-center transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      <GoogleIcon />
                    </button>
                    <button
                      onClick={() => setStep("email-login")}
                      className="h-16 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-white/10 text-foreground flex items-center justify-center transition-all active:scale-[0.98]"
                    >
                      <Mail className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <button onClick={onSkip} className="text-slate-500 text-xs font-bold hover:text-foreground transition-colors">
                      {t("login.skip")}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* --- OTP STEP --- */}
              {step === "otp" && (
                <motion.div
                  key="otp-step"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  className="space-y-8"
                >
                  <button onClick={handleBackToPhone} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2 group">
                    <div className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 group-hover:bg-white/10 transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">{t("login.changeNumber")}</span>
                  </button>

                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-black text-foreground px-2">{t("login.verify")}</h2>
                    <p className="text-muted-foreground text-sm">
                      <span className="text-cyan-400 font-bold tracking-wider">+998 {phoneNumber}</span> {t("login.enterOtpFor")}
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-8">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="••••••"
                      className="w-full h-20 text-center tracking-[0.6em] text-4xl font-black bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-foreground outline-none focus:border-cyan-500/50"
                      autoFocus
                    />

                    <AnimatePresence>
                      {phoneAuthError && <ErrorBanner message={phoneAuthError} />}
                    </AnimatePresence>

                    <button
                      type="submit"
                      disabled={isVerifyingOTP || otp.length < 6}
                      className="w-full h-16 rounded-2xl bg-cyan-500 text-slate-950 font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/10 active:scale-[0.98]"
                    >
                      {isVerifyingOTP ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t("login.verify")}<ShieldCheck className="w-5 h-5" /></>}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* --- EMAIL LOGIN STEP --- */}
              {step === "email-login" && (
                <motion.div
                  key="email-login-step"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  className="space-y-8"
                >
                  <button onClick={handleBackToPhone} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2 group">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">{t("login.loginWithPhone")}</span>
                  </button>

                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-black text-foreground">{t("login.login")}</h2>
                    <p className="text-muted-foreground text-sm">{t("login.welcome")}</p>
                  </div>

                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("login.email")}
                        className="w-full h-14 pl-12 pr-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t("login.password")}
                        className="w-full h-14 pl-12 pr-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    {emailError && <ErrorBanner message={emailError} />}
                    {googleAuthError && <ErrorBanner message={googleAuthError} />}

                    <button
                      type="submit"
                      disabled={isGoogleLoading}
                      className="w-full h-16 rounded-2xl bg-cyan-500 text-slate-950 font-black uppercase tracking-widest text-sm transition-all"
                    >
                      {isGoogleLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t("login.login")}
                    </button>
                  </form>

                  <div className="text-center">
                    <button onClick={() => setStep("email-register")} className="text-slate-500 text-xs font-bold hover:text-foreground">
                      {t("login.noAccount")} <span className="text-cyan-400">{t("login.register")}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* --- EMAIL REGISTER STEP --- */}
              {step === "email-register" && (
                <motion.div
                  key="email-register-step"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  className="space-y-8"
                >
                  <button onClick={() => setStep("email-login")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2 group">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">{t("common.back")}</span>
                  </button>

                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-black text-foreground">{t("login.register")}</h2>
                    <p className="text-muted-foreground text-sm">Yangi hisob yaratish</p>
                  </div>

                  <form onSubmit={handleEmailRegister} className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("login.name")}
                        className="w-full h-14 pl-12 pr-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("login.email")}
                        className="w-full h-14 pl-12 pr-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t("login.password")}
                        className="w-full h-14 pl-12 pr-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    {emailError && <ErrorBanner message={emailError} />}
                    {googleAuthError && <ErrorBanner message={googleAuthError} />}

                    <button
                      type="submit"
                      disabled={isGoogleLoading}
                      className="w-full h-16 rounded-2xl bg-cyan-500 text-slate-950 font-black uppercase tracking-widest text-sm transition-all"
                    >
                      {isGoogleLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t("login.register")}
                    </button>
                  </form>

                  <div className="text-center">
                    <button onClick={() => setStep("email-login")} className="text-slate-500 text-xs font-bold hover:text-foreground">
                      {t("login.haveAccount")} <span className="text-cyan-400">{t("login.login")}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>

        <p className="text-center mt-12 text-[10px] text-slate-700 font-black uppercase tracking-[0.4em]">
          &copy; 2026 UY JOY • Premium Experience
        </p>
      </motion.div>
    </div>
  );
}
