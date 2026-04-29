import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { PropertyCard } from "../components/PropertyCard";
import { useState, useMemo } from "react";
import { useProperties } from "../context/PropertyContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";

interface SearchScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function SearchScreen({ onNavigate }: SearchScreenProps) {
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
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "all", // sale, rent, all
    propertyType: "all", // house, apartment, etc
    district: "all",
    maxPrice: 2000,
    maxSize: 500,
  });

  const districts = [
    "Qarshi",
    "Shahrisabz",
    "Kitob",
    "G'uzor",
    "Kasbi",
    "Muborak",
    "Nishon",
    "Chiroqchi",
    "Yakkabog'",
    "Dehqonobod"
  ];

  const results = useMemo(() => {
    return properties.filter(property => {
      if (property.status !== "approved") return false;

      const matchesSearch = 
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
        property.district.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filters.type === "all" || property.type === filters.type;
      const matchesPropertyType = filters.propertyType === "all" || property.propertyType === filters.propertyType;
      const matchesDistrict = filters.district === "all" || property.district === filters.district;
      
      const numericPrice = parseInt(property.price.replace(/\D/g, "")) || 0;
      const matchesPrice = numericPrice <= filters.maxPrice;
      const matchesSize = property.size <= filters.maxSize;

      return matchesSearch && matchesType && matchesPropertyType && matchesDistrict && matchesPrice && matchesSize;
    });
  }, [properties, searchQuery, filters]);

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="z-30 border-b border-black/5 dark:border-white/5 bg-background/80 backdrop-blur-xl px-6 py-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <GlassCard className="flex-1 border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
              <div className="flex items-center gap-3 p-3">
                <Search className="h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("home.searchPlaceholder")}
                  className="flex-1 bg-transparent text-foreground placeholder-slate-500 outline-none text-sm"
                />
              </div>
            </GlassCard>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
                showFilters ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20" : "bg-black/5 dark:bg-white/5 text-foreground border border-black/10 dark:border-white/10"
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Type Filter */}
          <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
            {["all", "sale", "rent"].map((type) => (
              <button
                key={type}
                onClick={() => setFilters({ ...filters, type: type })}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  filters.type === type ? "bg-white text-slate-950 shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {type === "all" ? t("common.all") : type === "sale" ? t("add.sale") : t("add.rent")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results & Filters Container */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-40 bg-background p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-foreground">{t("search.filters")}</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 text-muted-foreground hover:text-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* District Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">{t("common.district")}</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilters({ ...filters, district: "all" })}
                      className={`px-4 py-3 rounded-xl border text-sm transition-all ${
                        filters.district === "all" ? "bg-cyan-500 text-slate-950 border-cyan-500 font-bold" : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-foreground"
                      }`}
                    >
                      {t("common.all")}
                    </button>
                    {districts.map(d => (
                      <button
                        key={d}
                        onClick={() => setFilters({ ...filters, district: d })}
                        className={`px-4 py-3 rounded-xl border text-sm transition-all ${
                          filters.district === d ? "bg-cyan-500 text-slate-950 border-cyan-500 font-bold" : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-foreground"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">{t("search.maxPrice")}</label>
                    <span className="text-lg font-bold text-foreground">
                      {filters.maxPrice >= 1000 
                        ? `${(filters.maxPrice / 1000).toFixed(1).replace('.0', '')} mlrd so'm` 
                        : `${filters.maxPrice.toLocaleString()} mln so'm`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="2000"
                    step="50"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full py-4 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-widest shadow-xl shadow-white/5 active:scale-95 transition-all"
                  >
                    {t("search.apply")}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results List */}
        <div className="h-full overflow-y-auto px-6 py-6 pb-24">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              {results.length} {t("search.results")}
            </h3>
            <div className="flex items-center gap-1 text-xs text-cyan-400 font-bold cursor-pointer">
              {t("profile.settings")} <ChevronDown className="w-3 h-3" />
            </div>
          </div>
          
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((property) => (
                <PropertyCard
                  key={property.id}
                  {...property}
                  isFavorite={favorites.includes(property.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onClick={() => onNavigate("detail", property)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-foreground font-medium mb-2">{t("search.noResults")}</p>
              <p className="text-slate-500 text-sm">{t("search.noResults")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
