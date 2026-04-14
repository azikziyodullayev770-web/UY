import { motion } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { PropertyCard } from "../components/PropertyCard";
import { useState } from "react";

interface SearchScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function SearchScreen({ onNavigate }: SearchScreenProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "sale",
    propertyType: "all",
    minPrice: 0,
    maxPrice: 2000000,
    minSize: 0,
    maxSize: 500,
  });

  const results = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1663756915304-40b7eda63e41?w=1080",
      price: "$425,000",
      location: "Tashkent, Yunusabad",
      rooms: 3,
      size: 150,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1628592102751-ba83b0314276?w=1080",
      price: "$380,000",
      location: "Samarkand, Center",
      rooms: 2,
      size: 120,
    },
  ];

  return (
    <div className="flex h-full flex-col bg-[#121212]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0B1D3A]/95 backdrop-blur-xl px-6 py-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <GlassCard className="flex-1">
              <div className="flex items-center gap-3 p-3">
                <Search className="h-5 w-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search location, property..."
                  className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
                />
              </div>
            </GlassCard>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-full p-3 backdrop-blur-md transition-colors ${
                showFilters ? "bg-[#00D4FF] text-black" : "bg-white/10 text-white"
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>

          {/* Category Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilters({ ...filters, category: "sale" })}
              className={`flex-1 rounded-xl px-4 py-2 font-medium transition-colors ${
                filters.category === "sale"
                  ? "bg-[#00D4FF] text-black"
                  : "bg-white/10 text-white"
              }`}
            >
              For Sale
            </button>
            <button
              onClick={() => setFilters({ ...filters, category: "rent" })}
              className={`flex-1 rounded-xl px-4 py-2 font-medium transition-colors ${
                filters.category === "rent"
                  ? "bg-[#00D4FF] text-black"
                  : "bg-white/10 text-white"
              }`}
            >
              For Rent
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-b border-white/10 bg-[#0B1D3A]/80 backdrop-blur-xl"
        >
          <div className="space-y-4 p-6">
            <div>
              <label className="mb-2 block text-sm text-white/80">Property Type</label>
              <div className="grid grid-cols-3 gap-2">
                {["All", "House", "Apartment", "Office"].map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setFilters({ ...filters, propertyType: type.toLowerCase() })
                    }
                    className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                      filters.propertyType === type.toLowerCase()
                        ? "bg-[#00D4FF] text-black"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">
                Price Range: ${filters.minPrice.toLocaleString()} - $
                {filters.maxPrice.toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="2000000"
                step="50000"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: parseInt(e.target.value) })
                }
                className="w-full accent-[#00D4FF]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">
                Size: {filters.minSize} - {filters.maxSize} m²
              </label>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={filters.maxSize}
                onChange={(e) =>
                  setFilters({ ...filters, maxSize: parseInt(e.target.value) })
                }
                className="w-full accent-[#00D4FF]"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-white/60">{results.length} properties found</p>
          <button className="text-sm text-[#00D4FF]">Sort: Newest</button>
        </div>
        <div className="space-y-4">
          {results.map((property) => (
            <PropertyCard
              key={property.id}
              {...property}
              onClick={() => onNavigate("detail", property)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
