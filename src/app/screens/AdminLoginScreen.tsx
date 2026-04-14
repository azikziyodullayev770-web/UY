import { motion } from "motion/react";
import { Shield, Lock, Phone, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { useState } from "react";

interface AdminLoginScreenProps {
  onAdminLogin: () => void;
  onBackToUser: () => void;
}

// Hardcoded admin credentials
const ADMIN_PHONE = "+998901234567";
const ADMIN_PASSWORD = "707077";

export function AdminLoginScreen({ onAdminLogin, onBackToUser }: AdminLoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const handleLogin = () => {
    const normalizedPhone = formData.phone.replace(/\s+/g, "");
    if (normalizedPhone === ADMIN_PHONE && formData.password === ADMIN_PASSWORD) {
      setError(null);
      onAdminLogin();
    } else {
      setError("Invalid phone number or password.");
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#0B1D3A] via-[#000000] to-[#0a0a0a] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Security Warning Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="border-red-500/30 bg-red-500/10">
            <div className="flex items-center gap-3 p-4">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <div>
                <p className="font-semibold text-red-400">Restricted Access</p>
                <p className="text-xs text-red-300/80">Authorized personnel only</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="relative mx-auto mb-6 inline-block"
          >
            <div className="rounded-full border-4 border-red-500/30 bg-gradient-to-br from-red-500/20 to-[#0B1D3A] p-5">
              <Shield className="h-12 w-12 text-red-400" />
            </div>
            <div className="absolute -right-1 -bottom-1 rounded-full bg-red-500 p-2">
              <Lock className="h-4 w-4 text-white" />
            </div>
          </motion.div>
          <h1 className="mb-2 text-3xl font-bold text-white">Admin Access</h1>
          <p className="text-red-400/80">System Administration Panel</p>
        </div>

        {/* Login Form */}
        <GlassCard className="border-white/20">
          <div className="p-6 space-y-5">
            {/* Phone Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-white/90">
                <Phone className="h-4 w-4 text-red-400" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+998 90 123 45 67"
                className="w-full rounded-xl border border-red-500/20 bg-black/40 px-4 py-3 text-white placeholder-white/30 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-white/90">
                <Lock className="h-4 w-4 text-red-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-red-500/20 bg-black/40 px-4 py-3 pr-12 text-white placeholder-white/30 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-red-500/30 transition-all hover:shadow-red-500/50 hover:scale-[1.02]"
            >
              Access Admin Panel
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#121212] px-2 text-white/40">or</span>
              </div>
            </div>

            {/* Back to User Login */}
            <button
              onClick={onBackToUser}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition-all hover:bg-white/10"
            >
              Back to User Login
            </button>
          </div>
        </GlassCard>

        {/* Security Notice */}
        <p className="text-center text-xs text-white/40">
          All access attempts are logged and monitored
        </p>
        <p className="text-center text-xs text-white/25 mt-1">
          Demo: +998901234567 / 707077
        </p>
      </motion.div>
    </div>
  );
}
