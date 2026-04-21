import { motion } from "motion/react";
import { Heart, Search, ArrowLeft, Ghost } from "lucide-react";
import { useTranslation } from "../context/LanguageContext";
import { PropertyCard } from "../components/PropertyCard";
import { useProperties } from "../context/PropertyContext.tsx";

interface FavoritesScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack?: () => void;
}

export function FavoritesScreen({ onNavigate, onBack }: FavoritesScreenProps) {
  const { properties, favorites, toggleFavorite } = useProperties();
  const { t } = useTranslation();
  
  const favoriteListings = properties.filter(p => favorites.includes(p.id));

  return (
    <div className="h-full overflow-y-auto bg-slate-950 pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl px-6 py-6 transition-all">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white transition-all active:scale-95"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{t("nav.favorites")}</h1>
              <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">{favoriteListings.length} {t("search.results")}</p>
            </div>
          </div>
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
            <Heart className="w-6 h-6 fill-current" />
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {favoriteListings.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {favoriteListings.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <PropertyCard
                  {...property}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                  onClick={() => onNavigate("detail", property)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-6"
          >
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Ghost className="w-12 h-12 text-slate-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">{t("profile.noFavorites")}</h3>
              <p className="text-slate-400 text-sm max-w-[240px] mx-auto">
                {t("login.message")}
              </p>
            </div>
            <button
              onClick={() => onNavigate("home")}
              className="px-8 py-3 rounded-xl bg-white text-slate-950 font-bold shadow-lg shadow-white/10 active:scale-95 transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {t("common.all")}
            </button>
          </motion.div>
        )}

        {/* Tip Card */}
        {favoriteListings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-white/5"
          >
            <p className="text-xs text-slate-400 leading-relaxed text-center italic">
              "Saralangan e'lonlar narxi o'zgarsa yoki sotilsa, biz sizga xabar beramiz."
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
