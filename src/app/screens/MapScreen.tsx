import { motion } from "motion/react";
import { MapPin, SlidersHorizontal } from "lucide-react";
import { GlassCard } from "../components/GlassCard";

interface MapScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function MapScreen({ onNavigate }: MapScreenProps) {
  const pins = [
    { id: 1, price: "$425K", x: "30%", y: "40%" },
    { id: 2, price: "$850K", x: "60%", y: "30%" },
    { id: 3, price: "$380K", x: "45%", y: "60%" },
    { id: 4, price: "$620K", x: "70%", y: "50%" },
    { id: 5, price: "$295K", x: "25%", y: "70%" },
  ];

  return (
    <div className="relative h-full bg-gradient-to-br from-[#0B1D3A] via-[#1a2942] to-[#121212]">
      {/* Map Container */}
      <div className="relative h-full w-full">
        {/* Price Pins */}
        {pins.map((pin) => (
          <motion.button
            key={pin.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 * pin.id }}
            whileHover={{ scale: 1.1 }}
            onClick={() => onNavigate("detail", {})}
            className="absolute"
            style={{ left: pin.x, top: pin.y }}
          >
            <div className="relative">
              <div className="rounded-full bg-[#00D4FF] px-3 py-1.5 shadow-lg shadow-[#00D4FF]/30">
                <p className="text-sm font-semibold text-black">{pin.price}</p>
              </div>
              <div className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 rotate-45 bg-[#00D4FF]" />
              <motion.div
                className="absolute inset-0 rounded-full bg-[#00D4FF]/30"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Floating Filter Button */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2"
      >
        <GlassCard hover onClick={() => onNavigate("search")}>
          <button className="flex items-center gap-2 px-6 py-3">
            <SlidersHorizontal className="h-5 w-5 text-white" />
            <span className="font-medium text-white">Filters</span>
          </button>
        </GlassCard>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className="absolute top-6 left-6"
      >
        <GlassCard>
          <div className="p-4 space-y-2">
            <p className="text-sm font-medium text-white">Map Legend</p>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#00D4FF]" />
              <span className="text-xs text-white/70">Available Properties</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
