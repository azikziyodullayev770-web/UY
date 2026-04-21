import { motion, AnimatePresence } from "motion/react";
import { GlassCard } from "../components/GlassCard";
import { Building2, ArrowRight, ShieldCheck, ChevronLeft, Loader2, X, Globe } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";

interface LoginScreenProps {
  onLogin: () => void;
  onSkip?: () => void;
}

type LoginStep = "phone" | "otp";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.1c-.22-.67-.35-1.39-.35-2.1s.13-1.43.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
  </svg>
);

export function LoginScreen({ onLogin, onSkip }: LoginScreenProps) {
  const { sendOTP, verifyOTP, loginWithGoogle } = useAuth();
  const { t } = useTranslation();
  const [step, setStep] = useState<LoginStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPhoneValid = phoneNumber.replace(/\s/g, "").length === 9;

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const trimmed = digits.slice(0, 9);
    
    let result = "";
    if (trimmed.length > 0) result += trimmed.slice(0, 2);
    if (trimmed.length > 2) result += " " + trimmed.slice(2, 5);
    if (trimmed.length > 5) result += " " + trimmed.slice(5, 7);
    if (trimmed.length > 7) result += " " + trimmed.slice(7, 9);
    
    return result;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError(null);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid) {
      setError("Telefon raqamingizni to'liq kiriting");
      return;
    }

    setIsLoading(true);
    const fullPhone = `+998${phoneNumber.replace(/\s/g, "")}`;
    const success = await sendOTP(fullPhone);
    setIsLoading(false);

    if (success) {
      setStep("otp");
    } else {
      setError("Kod yuborishda xatolik yuz berdi");
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const success = await loginWithGoogle();
    setIsGoogleLoading(false);
    if (success) {
      onLogin();
    } else {
      setError("Google orqali kirishda xatolik yuz berdi");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;

    setIsLoading(true);
    const fullPhone = `+998${phoneNumber.replace(/\s/g, "")}`;
    const success = await verifyOTP(fullPhone, otp);
    setIsLoading(false);

    if (success) {
      onLogin();
    } else {
      setError("Tasdiqlash kodi noto'g'ri");
      setOtp("");
    }
  };

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center bg-slate-950 px-6 py-12 overflow-y-auto">
      {/* Background Decor */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[30%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10 flex flex-col items-center justify-center flex-grow"
      >
        <div className="text-center mb-8 relative w-full">
          {onSkip && (
            <button 
              onClick={onSkip}
              className="absolute -top-4 right-0 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 mb-6"
          >
            <Building2 className="text-white w-10 h-10" />
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">{t("home.title")}</h1>
          <p className="text-slate-400 text-sm font-medium">{t("login.slogan")}</p>
        </div>

        <GlassCard className="w-full overflow-hidden border-white/10">
          <div className="p-8 relative">
            <AnimatePresence mode="wait">
              {step === "phone" ? (
                <motion.div
                  key="phone-step"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-black text-white">{t("login.welcome")}</h2>
                    <p className="text-slate-400 text-sm px-4">
                      {t("login.message")}
                    </p>
                  </div>

                  <form onSubmit={handleSendCode} className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t("login.phone")}</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center gap-2 pr-3 border-r border-white/10 group-focus-within:border-cyan-500/50 transition-colors">
                          <Globe className="w-4 h-4 text-cyan-500" />
                          <span className="text-white font-bold">+998</span>
                        </div>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          placeholder="90 123 45 67"
                          className="w-full h-16 pl-28 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xl font-bold outline-none transition-all focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 placeholder:text-white/10"
                          autoFocus
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-red-400 text-xs font-medium text-center">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || !isPhoneValid}
                      className="w-full h-16 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-900 disabled:text-slate-600 text-slate-950 font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/10 active:scale-[0.98]"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          {t("common.confirm")}
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="relative py-4 flex items-center">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink mx-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{t("login.or")}</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  <button
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isGoogleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
                    <span>{t("login.google")}</span>
                  </button>

                  <div className="text-center pt-2">
                    <button 
                      onClick={onSkip}
                      className="text-slate-500 text-xs font-bold hover:text-white transition-colors"
                    >
                      {t("login.skip")}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="otp-step"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <button
                    onClick={() => setStep("phone")}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm font-bold">{t("login.changeNumber")}</span>
                  </button>

                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-black text-white px-2">{t("login.verify")}</h2>
                    <p className="text-slate-400 text-sm">
                      <span className="text-cyan-400 font-bold tracking-wider">+998 {phoneNumber}</span> {t("login.enterOtpFor")}
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-8">
                    <div className="flex justify-center flex-col items-center">
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setOtp(val);
                          setError(null);
                        }}
                        placeholder="••••••"
                        className="w-full h-20 text-center tracking-[0.6em] text-4xl font-black bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 placeholder:text-white/10 shadow-inner"
                        autoFocus
                      />
                    </div>

                    {error && (
                      <p className="text-red-400 text-xs font-medium text-center">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || otp.length < 6}
                      className="w-full h-16 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-900 disabled:text-slate-600 text-slate-950 font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/10 active:scale-[0.98]"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          {t("login.verify")}
                          <ShieldCheck className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    <div className="text-center">
                      <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-3">{t("login.codeNotReceived")}</p>
                      <button
                        type="button"
                        className="text-cyan-400 text-xs font-bold hover:text-cyan-300 transition-colors underline underline-offset-4 decoration-2"
                        onClick={() => sendOTP(`+998${phoneNumber.replace(/\s/g, "")}`)}
                      >
                        {t("login.resendCode")}
                      </button>
                    </div>
                  </form>
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
