import { Heart, MapPin, Bed, Maximize, Star } from "lucide-react";
import { motion } from "motion/react";
import { GlassCard } from "./GlassCard";
import { useTranslation } from "../context/LanguageContext";

interface PropertyCardProps {
  id: number;
  image: string;
  title?: string;
  price: string;
  location: string;
  rooms?: number;
  size?: number;
  isTop?: boolean;
  topExpiresAt?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  onClick?: () => void;
}

export function PropertyCard({
  id,
  image,
  title,
  price,
  location,
  rooms,
  size,
  isTop,
  topExpiresAt,
  isFavorite,
  onToggleFavorite,
  onClick,
}: PropertyCardProps) {
  const { t } = useTranslation();
  const isTopActive = isTop && (!topExpiresAt || topExpiresAt > Date.now());
  return (
    <GlassCard 
      onClick={onClick} 
      className={`group overflow-hidden border-black/5 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all hover:shadow-[0_12px_40px_rgba(34,211,238,0.15)] ${
        isTop ? "ring-1 ring-cyan-500/50" : ""
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <motion.img 
          src={image || "https://images.unsplash.com/photo-1663756915304-40b7eda63e41?w=1080"} 
          alt={location} 
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1663756915304-40b7eda63e41?w=1080";
          }}
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isTopActive && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black text-[10px] uppercase tracking-wider shadow-lg shadow-yellow-500/20">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>TOP</span>
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(id);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute top-3 right-3 rounded-2xl p-2.5 backdrop-blur-md transition-all ${
            isFavorite 
              ? "bg-red-500 text-foreground shadow-lg shadow-red-500/40" 
              : "bg-black/30 text-foreground/90 hover:bg-black/50"
          }`}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
        </motion.button>

        {/* Price Blur Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent opacity-80" />
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground/90 truncate mb-1">
            {title || `${rooms ? rooms + ' xonali ' : ''}${location}`}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-foreground tracking-tight">{price}</span>
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider italic">{t("common.kelishiladi")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <MapPin className="h-3.5 w-3.5 text-cyan-500/70" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
          <div className="flex gap-4">
            {rooms && (
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{t("common.rooms")}</span>
                <div className="flex items-center gap-1.5">
                  <Bed className="h-4 w-4 text-foreground/60" />
                  <span className="text-foreground font-medium">{rooms} {t("common.rooms").toLowerCase()}</span>
                </div>
              </div>
            )}
            {size && (
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{t("common.size")}</span>
                <div className="flex items-center gap-1.5">
                  <Maximize className="h-4 w-4 text-foreground/60" />
                  <span className="text-foreground font-medium">{size} m²</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="h-8 w-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// Simple ArrowRight component if not imported
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
