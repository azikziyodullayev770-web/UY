import { motion } from "motion/react";
import { useEffect } from "react";
import { Building2 } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#0B1D3A] via-[#121212] to-[#0a0a0a]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          <Building2 className="mx-auto mb-6 h-20 w-20 text-[#00D4FF]" />
        </motion.div>
        <h1 className="mb-2 text-3xl font-bold text-white">UY JOY</h1>
        <p className="text-lg text-[#00D4FF]">SOTISH VA SOTIB OLISH</p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, delay: 0.5 }}
          className="mx-auto mt-8 h-1 max-w-xs rounded-full bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent"
        />
      </motion.div>
    </div>
  );
}
