import { motion } from "motion/react";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { PropertyCard } from "../components/PropertyCard";
import { GlassCard } from "../components/GlassCard";

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const topListings = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1706808849827-7366c098b317?w=1080",
      price: "$850,000",
      location: "QASHQADARYO, SHAXRISABZ, CENTER",
      rooms: 4,
      size: 320,
      isTop: true,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1706855203772-c249b75fe016?w=1080",
      price: "$1,200,000",
      location: "QASHQADARYO, GUZOR, CENTER",
      rooms: 5,
      size: 450,
      isTop: true,
    },
  ];

  const newListings = [
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1663756915304-40b7eda63e41?w=1080",
      price: "$425,000",
      location: "Tashkent, Yunusabad",
      rooms: 3,
      size: 150,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1628592102751-ba83b0314276?w=1080",
      price: "$380,000",
      location: "Samarkand, Center",
      rooms: 2,
      size: 120,
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1706808849780-7a04fbac83ef?w=1080",
      price: "$620,000",
      location: "Bukhara, Center",
      rooms: 4,
      size: 200,
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=1080",
      price: "$295,000",
      location: "Tashkent, Mirzo Ulugbek",
      rooms: 2,
      size: 95,
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-[#121212] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0B1D3A]/95 backdrop-blur-xl px-6 py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Find Your Home</h1>
              <p className="text-sm text-white/60">Discover the perfect property</p>
            </div>
            <button
              onClick={() => onNavigate("search")}
              className="rounded-full bg-white/10 p-3 backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <SlidersHorizontal className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Search Bar */}
          <GlassCard onClick={() => onNavigate("search")}>
            <div className="flex items-center gap-3 p-4">
              <Search className="h-5 w-5 text-white/40" />
              <input
                type="text"
                placeholder="Search location, property..."
                className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
                readOnly
              />
              <MapPin className="h-5 w-5 text-[#00D4FF]" />
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Content */}
      <div className="space-y-8 px-6 py-6">
        {/* Top Listings */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Top Listings</h2>
            <button
              onClick={() => onNavigate("top")}
              className="text-sm text-[#00D4FF] hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {topListings.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <PropertyCard
                  {...property}
                  onClick={() => onNavigate("detail", property)}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* New Listings */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="mb-4 text-xl font-semibold text-white">New Listings</h2>
          <div className="grid grid-cols-2 gap-4">
            {newListings.map((property, index) => (
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
          </div>
        </motion.section>
      </div>
    </div>
  );
}
