import { motion } from "motion/react";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { PropertyCard } from "../components/PropertyCard";
import { GlassCard } from "../components/GlassCard";
import { useProperties, Property } from "../context/PropertyContext.tsx";
import { useAuth } from "../context/AuthContext";

import { useTranslation } from "../context/LanguageContext";

import logo from "../assets/logo.png";

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
  const topListings = approvedProperties.filter((p: Property) => p.isTop && (!p.topExpiresAt || p.topExpiresAt > now)).slice(0, 3);
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
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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

        {/* Guest CTA Section */}
        {!isAuthenticated && (
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-10"
          >
            <GlassCard className="p-8 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/20 text-center space-y-6 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 blur-[80px] rounded-full" />
              
              <div className="space-y-2 relative z-10">
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">{t("login.welcome")}</h3>
                <p className="text-sm text-slate-400 max-w-xs mx-auto">
                  O'z uyingizni sotishni yoki ijaraga berishni xohlaysizmi? Hoziroq ro'yxatdan o'ting!
                </p>
              </div>

              <div className="flex flex-col gap-3 relative z-10">
                <button 
                  onClick={() => onNavigate("login")}
                  className="w-full py-4 rounded-2xl bg-cyan-500 text-slate-950 font-black uppercase tracking-widest text-xs shadow-xl shadow-cyan-500/20 active:scale-95 transition-all"
                >
                  {t("login.register")}
                </button>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                  Barcha imkoniyatlardan foydalaning
                </p>
              </div>
            </GlassCard>
          </motion.section>
        )}
      </div>
    </div>
  );
}
