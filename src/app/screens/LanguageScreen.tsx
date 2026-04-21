import { motion } from "motion/react";
import { GlassCard } from "../components/GlassCard";
import { Globe } from "lucide-react";
import { useTranslation } from "../context/LanguageContext";

interface LanguageScreenProps {
  onSelectLanguage: (lang: string) => void;
}

export function LanguageScreen({ onSelectLanguage }: LanguageScreenProps) {
  const { t } = useTranslation();
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "uz", name: "O'zbek", flag: "🇺🇿" },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#0B1D3A] via-[#121212] to-[#0a0a0a] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <Globe className="mx-auto mb-4 h-16 w-16 text-[#00D4FF]" />
          <h1 className="mb-2 text-3xl font-bold text-white">{t("login.chooseLanguage")}</h1>
          <p className="text-white/60">{t("login.selectLanguage")}</p>
        </div>

        <div className="space-y-4">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard hover onClick={() => onSelectLanguage(lang.code)}>
                <button className="flex w-full items-center gap-4 p-5">
                  <span className="text-4xl">{lang.flag}</span>
                  <span className="text-xl font-medium text-white">{lang.name}</span>
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
