import { motion } from "motion/react";
import { Search, MapPin, SlidersHorizontal, Sparkles } from "lucide-react";
import { PropertyCard } from "../components/PropertyCard";
import { GlassCard } from "../components/GlassCard";
import { useProperties, Property } from "../context/PropertyContext.tsx";
import { useAuth } from "../context/AuthContext";

import { useTranslation } from "../context/LanguageContext";

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { properties, favorites, toggleFavorite } = useProperties();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const handleToggleFavorite = (id: number) => {
    if (!isAuthenticated) {
      onNavigate("login", { id, action: "toggleFavorite" });
      return;
    }
    toggleFavorite(id);
  };

  const now = Date.now();
  const approvedProperties = properties.filter((p: Property) => p.status === "approved");
  const topListings = approvedProperties.filter((p: Property) => p.isTop && (!p.topExpiresAt || p.topExpiresAt > now));
  const newListings = approvedProperties.filter((p: Property) => !p.isTop || (p.topExpiresAt && p.topExpiresAt <= now));

  return (
    <div className="h-full overflow-y-auto bg-background pb-32 scroll-smooth">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full -z-10" />
      
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-black/5 dark:border-white/5 bg-background/80 backdrop-blur-xl px-6 py-5">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">{t("home.title")}</h1>
                <p className="text-[10px] text-cyan-400/80 uppercase font-black tracking-widest leading-none">{t("home.subtitle")}</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate("search")}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground transition-all active:scale-95 hover:bg-white/10"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>

          {/* Search Bar */}
          <GlassCard onClick={() => onNavigate("search")} className="border-black/5 dark:border-white/5">
            <div className="flex items-center gap-3 p-3.5">
              <Search className="h-5 w-5 text-slate-500" />
              <div className="flex-1 bg-transparent text-muted-foreground text-sm">
                {t("home.searchPlaceholder")}
              </div>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <MapPin className="h-4 w-4 text-cyan-500" />
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Content */}
      <div className="space-y-10 px-6 py-8">
        {/* Top Listings */}
        {topListings.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-cyan-500 rounded-full" />
                <h2 className="text-lg font-bold text-foreground tracking-tight">{t("home.topListings")}</h2>
              </div>
              <button
                onClick={() => onNavigate("favorites")}
                className="text-xs font-bold text-cyan-400 uppercase tracking-wider hover:text-cyan-300"
              >
                {t("common.all")}
              </button>
            </div>
            <div className="space-y-5">
              {topListings.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <PropertyCard
                    {...property}
                    isFavorite={favorites.includes(property.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onClick={() => onNavigate("detail", property)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* New Listings */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-5 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-slate-700 rounded-full" />
            <h2 className="text-lg font-bold text-foreground tracking-tight">{t("home.newListings")}</h2>
          </div>
          <div className="grid grid-cols-1 gap-5">
            {newListings.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <PropertyCard
                  {...property}
                  isFavorite={favorites.includes(property.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onClick={() => onNavigate("detail", property)}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
