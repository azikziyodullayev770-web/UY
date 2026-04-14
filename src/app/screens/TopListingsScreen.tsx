import { motion } from "motion/react";
import { Crown, TrendingUp, ArrowLeft } from "lucide-react";
import { PropertyCard } from "../components/PropertyCard";
import { GlassCard } from "../components/GlassCard";

interface TopListingsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack?: () => void;
}

export function TopListingsScreen({ onNavigate, onBack }: TopListingsScreenProps) {
  const topListings = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1706808849827-7366c098b317?w=1080",
      price: "$850,000",
      location: "Guzar, Qashqadaryo",
      rooms: 4,
      size: 320,
      isTop: true,
      isPremium: true,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1706855203772-c249b75fe016?w=1080",
      price: "$1,200,000",
      location: "Kitab, Qashqadaryo",
      rooms: 5,
      size: 450,
      isTop: true,
      isPremium: true,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1706808849780-7a04fbac83ef?w=1080",
      price: "$620,000",
      location: "Bukhara, Historic District",
      rooms: 4,
      size: 200,
      isTop: true,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1766603636700-e9d80473f40f?w=1080",
      price: "$950,000",
      location: "Tashkent, Mirabad",
      rooms: 5,
      size: 380,
      isTop: true,
      isPremium: true,
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-[#121212] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[#FFD700]/20 bg-gradient-to-br from-[#0B1D3A] to-[#121212] px-6 py-6 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            {onBack && (
              <button
                onClick={onBack}
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#FFD700]/20 p-3">
                  <Crown className="h-8 w-8 text-[#FFD700]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Top Listings</h1>
                  <p className="text-sm text-[#FFD700]/80">Premium Featured Properties</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <GlassCard className="border-[#FFD700]/20 bg-gradient-to-r from-[#FFD700]/10 to-transparent">
            <div className="flex items-center gap-4 p-4">
              <TrendingUp className="h-6 w-6 text-[#FFD700]" />
              <div className="flex-1">
                <p className="text-sm text-white/60">Boosted Properties</p>
                <p className="text-xl font-semibold text-white">{topListings.length} Active</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/60">Priority Placement</p>
                <p className="text-lg font-semibold text-[#FFD700]">TOP</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Content */}
      <div className="space-y-4 px-6 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {topListings.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <PropertyCard
                {...property}
                onClick={() => onNavigate("detail", property)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Info Card */}
        <GlassCard className="mt-8">
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-[#FFD700]" />
              <h3 className="font-semibold text-white">About TOP Listings</h3>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              TOP listings receive premium placement across all search results, home feed, and
              map views. These properties are verified and boosted to reach maximum visibility.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="h-2 w-2 rounded-full bg-[#FFD700]" />
                <span>Priority in search results</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="h-2 w-2 rounded-full bg-[#FFD700]" />
                <span>Featured on homepage</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="h-2 w-2 rounded-full bg-[#FFD700]" />
                <span>Highlighted with gold badge</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
