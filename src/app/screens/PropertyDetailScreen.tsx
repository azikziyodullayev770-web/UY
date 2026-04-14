import { motion } from "motion/react";
import { ArrowLeft, Heart, Share2, Phone, MessageCircle, MapPin, Bed, Maximize, Shield } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { Badge } from "../components/Badge";
import { PropertyCard } from "../components/PropertyCard";
import { useState } from "react";

interface PropertyDetailScreenProps {
  property?: any;
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export function PropertyDetailScreen({ property, onNavigate, onBack }: PropertyDetailScreenProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1663756915304-40b7eda63e41?w=1080",
    "https://images.unsplash.com/photo-1628592102751-ba83b0314276?w=1080",
    "https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=1080",
  ];

  const similarListings = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1706808849780-7a04fbac83ef?w=1080",
      price: "$620,000",
      location: "Bukhara, Historic District",
      rooms: 4,
      size: 200,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1638454795595-0a0abf68614d?w=1080",
      price: "$295,000",
      location: "Tashkent, Mirzo Ulugbek",
      rooms: 2,
      size: 95,
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-[#121212] pb-32">
      {/* Image Gallery */}
      <div className="relative">
        <motion.img
          key={currentImage}
          src={images[currentImage]}
          alt="Property"
          className="h-96 w-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Header Controls */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="rounded-full bg-black/40 p-2 backdrop-blur-md transition-colors hover:bg-black/60"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <div className="flex gap-2">
            <button className="rounded-full bg-black/40 p-2 backdrop-blur-md transition-colors hover:bg-black/60">
              <Share2 className="h-6 w-6 text-white" />
            </button>
            <button className="rounded-full bg-black/40 p-2 backdrop-blur-md transition-colors hover:bg-black/60">
              <Heart className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentImage ? "w-8 bg-[#00D4FF]" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 px-6 py-6">
        {/* Price & Title */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <h1 className="text-4xl font-bold text-[#00D4FF]">$425,000</h1>
            <Badge variant="premium">TOP</Badge>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <MapPin className="h-5 w-5" />
            <p>Tashkent, Yunusabad District, Street 12</p>
          </div>
        </div>

        {/* Stats */}
        <GlassCard>
          <div className="grid grid-cols-3 divide-x divide-white/10 p-4">
            <div className="px-4 text-center">
              <Bed className="mx-auto mb-2 h-6 w-6 text-[#00D4FF]" />
              <p className="text-2xl font-semibold text-white">3</p>
              <p className="text-sm text-white/60">Bedrooms</p>
            </div>
            <div className="px-4 text-center">
              <Maximize className="mx-auto mb-2 h-6 w-6 text-[#00D4FF]" />
              <p className="text-2xl font-semibold text-white">150</p>
              <p className="text-sm text-white/60">m²</p>
            </div>
            <div className="px-4 text-center">
              <Shield className="mx-auto mb-2 h-6 w-6 text-[#00D4FF]" />
              <p className="text-sm font-semibold text-white">Verified</p>
              <p className="text-sm text-white/60">Seller</p>
            </div>
          </div>
        </GlassCard>

        {/* Description */}
        <GlassCard>
          <div className="p-5 space-y-3">
            <h3 className="text-lg font-semibold text-white">Description</h3>
            <p className="text-white/70 leading-relaxed">
              Modern 3-bedroom apartment in the heart of Yunusabad. Features include spacious
              living areas, contemporary kitchen with premium appliances, master bedroom with
              en-suite bathroom, and stunning city views. Located near schools, shopping centers,
              and public transportation.
            </p>
          </div>
        </GlassCard>

        {/* Map Preview */}
        <GlassCard>
          <div className="aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1D3A] to-[#121212]">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto mb-2 h-12 w-12 text-[#00D4FF]" />
                <p className="text-white/60">Map View</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Similar Listings */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Similar Properties</h3>
          <div className="grid grid-cols-2 gap-4">
            {similarListings.map((listing) => (
              <PropertyCard
                key={listing.id}
                {...listing}
                onClick={() => onNavigate("detail", listing)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#0B1D3A]/95 backdrop-blur-xl p-6">
        <div className="mx-auto flex max-w-md gap-3">
          <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition-all hover:bg-white/10">
            <Phone className="h-5 w-5" />
            Call
          </button>
          <button
            onClick={() => onNavigate("chat")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00D4FF] px-6 py-3 font-medium text-black transition-all hover:bg-[#00D4FF]/90"
          >
            <MessageCircle className="h-5 w-5" />
            Message Seller
          </button>
        </div>
      </div>
    </div>
  );
}
