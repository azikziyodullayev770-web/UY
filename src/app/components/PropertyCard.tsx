import { motion } from "motion/react";
import { Heart, MapPin, Bed, Maximize } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Badge } from "./Badge";

interface PropertyCardProps {
  image: string;
  price: string;
  location: string;
  rooms?: number;
  size?: number;
  isPremium?: boolean;
  isTop?: boolean;
  onSave?: () => void;
  onClick?: () => void;
}

export function PropertyCard({
  image,
  price,
  location,
  rooms,
  size,
  isPremium,
  isTop,
  onSave,
  onClick,
}: PropertyCardProps) {
  return (
    <GlassCard hover onClick={onClick} className={`overflow-hidden ${isTop ? "ring-2 ring-[#FFD700]" : ""}`}>
      <div className="relative">
        <img src={image} alt={location} className="h-48 w-full object-cover" />
        {isTop && (
          <div className="absolute top-3 left-3">
            <Badge variant="premium">TOP</Badge>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave?.();
          }}
          className="absolute top-3 right-3 rounded-full bg-black/40 p-2 backdrop-blur-md transition-colors hover:bg-black/60"
        >
          <Heart className="h-5 w-5 text-white" />
        </button>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-semibold text-[#00D4FF]">{price}</span>
          {isPremium && <Badge variant="premium">Premium</Badge>}
        </div>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{location}</span>
        </div>
        {(rooms || size) && (
          <div className="flex items-center gap-4 text-sm text-white/80">
            {rooms && (
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4" />
                <span>{rooms} rooms</span>
              </div>
            )}
            {size && (
              <div className="flex items-center gap-1.5">
                <Maximize className="h-4 w-4" />
                <span>{size} m²</span>
              </div>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
