import { motion } from "motion/react";
import { User, Heart, Home, Settings, Globe, LogOut, Shield, ChevronRight } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { Badge } from "../components/Badge";
import { PropertyCard } from "../components/PropertyCard";

interface ProfileScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onLanguageChange: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ onNavigate, onLanguageChange, onLogout }: ProfileScreenProps) {
  const myListings = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1663756915304-40b7eda63e41?w=1080",
      price: "$425,000",
      location: "Tashkent, Yunusabad",
      rooms: 3,
      size: 150,
      isTop: true,
    },
  ];

  const savedListings = [
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1628592102751-ba83b0314276?w=1080",
      price: "$380,000",
      location: "Samarkand, Center",
      rooms: 2,
      size: 120,
    },
  ];

  const menuItems = [
    { icon: Globe, label: "Change Language", onClick: onLanguageChange },
    { icon: Settings, label: "Settings", onClick: () => {} },
    { icon: LogOut, label: "Logout", onClick: onLogout, danger: true },
  ];

  return (
    <div className="h-full overflow-y-auto bg-[#121212] pb-24">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-br from-[#0B1D3A] to-[#121212] px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="relative mx-auto mb-4 inline-block">
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#00D4FF]/30 bg-gradient-to-br from-[#00D4FF] to-[#0B1D3A]">
              <User className="h-full w-full p-4 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-[#00D4FF] p-2">
              <Shield className="h-4 w-4 text-black" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">AZIZBEK USER</h1>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="verified">Verified User</Badge>
          </div>
          <p className="mt-2 text-sm text-white/60">+998 90 123 45 67</p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="space-y-6 px-6 py-6">
        {/* Stats */}
        <GlassCard>
          <div className="grid grid-cols-3 divide-x divide-white/10 p-4">
            <div className="px-4 text-center">
              <Home className="mx-auto mb-2 h-6 w-6 text-[#00D4FF]" />
              <p className="text-2xl font-semibold text-white">{myListings.length}</p>
              <p className="text-sm text-white/60">My Listings</p>
            </div>
            <div className="px-4 text-center">
              <Heart className="mx-auto mb-2 h-6 w-6 text-[#00D4FF]" />
              <p className="text-2xl font-semibold text-white">{savedListings.length}</p>
              <p className="text-sm text-white/60">Saved</p>
            </div>
            <div className="px-4 text-center">
              <Shield className="mx-auto mb-2 h-6 w-6 text-[#00D4FF]" />
              <p className="text-sm font-semibold text-white">Active</p>
              <p className="text-sm text-white/60">Status</p>
            </div>
          </div>
        </GlassCard>

        {/* My Listings */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">My Listings</h2>
          <div className="space-y-4">
            {myListings.map((listing) => (
              <PropertyCard
                key={listing.id}
                {...listing}
                onClick={() => onNavigate("detail", listing)}
              />
            ))}
          </div>
        </div>

        {/* Saved Listings */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Saved Properties</h2>
          <div className="space-y-4">
            {savedListings.map((listing) => (
              <PropertyCard
                key={listing.id}
                {...listing}
                onClick={() => onNavigate("detail", listing)}
              />
            ))}
          </div>
        </div>

        {/* Menu */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Settings</h2>
          <GlassCard>
            <div className="divide-y divide-white/10">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className={`flex w-full items-center justify-between p-4 transition-colors hover:bg-white/5 ${
                      item.danger ? "text-red-400" : "text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 opacity-60" />
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
