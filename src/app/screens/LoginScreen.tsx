import { motion } from "motion/react";
import { GlassCard } from "../components/GlassCard";
import { Building2, Phone, Shield } from "lucide-react";
import { useState } from "react";

interface LoginScreenProps {
  onLogin: () => void;
  onAdminAccess: () => void;
}

export function LoginScreen({ onLogin, onAdminAccess }: LoginScreenProps) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [tapCount, setTapCount] = useState(0);

  const [error, setError] = useState<string | null>(null);

  const handleSendOTP = () => {
    if (phone.length > 0) {
      setStep("otp");
      setError(null);
    }
  };

  const handleVerifyOTP = () => {
    if (otp === "123456") {
      onLogin();
    } else {
      setError("Invalid OTP. Please try '123456'.");
    }
  };

  // Hidden admin access - triple tap on logo
  const handleLogoTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount >= 5) {
      onAdminAccess();
      setTapCount(0);
    }

    // Reset counter after 2 seconds
    setTimeout(() => setTapCount(0), 2000);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#0B1D3A] via-[#121212] to-[#0a0a0a] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <motion.button
            onClick={handleLogoTap}
            whileTap={{ scale: 0.95 }}
            className="relative mx-auto mb-4"
            animate={tapCount > 0 ? { rotate: [0, -10, 10, -10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Building2 className="h-16 w-16 text-[#00D4FF]" />
            {tapCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
              >
                {tapCount}
              </motion.div>
            )}
          </motion.button>
          <h1 className="mb-2 text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/60">Login to continue</p>
        </div>

        <GlassCard>
          <div className="p-6 space-y-6">
            {step === "phone" ? (
              <>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-white/80">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition-all focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/20"
                  />
                </div>

                <button
                  onClick={handleSendOTP}
                  className="w-full rounded-xl bg-[#00D4FF] px-6 py-3 font-medium text-black transition-all hover:bg-[#00D4FF]/90"
                >
                  Send OTP
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[#121212] px-2 text-white/60">or</span>
                  </div>
                </div>

                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition-all hover:bg-white/10">
                  <Shield className="h-5 w-5" />
                  Verify with Passport ID
                </button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm text-white/80">
                    Enter OTP Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-2xl tracking-widest text-white placeholder-white/40 outline-none transition-all focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/20"
                  />
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>

                <button
                  onClick={handleVerifyOTP}
                  className="w-full rounded-xl bg-[#00D4FF] px-6 py-3 font-medium text-black transition-all hover:bg-[#00D4FF]/90"
                >
                  Verify & Login
                </button>

                <button
                  onClick={() => setStep("phone")}
                  className="w-full text-sm text-white/60 hover:text-white"
                >
                  Back to phone number
                </button>
              </>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
