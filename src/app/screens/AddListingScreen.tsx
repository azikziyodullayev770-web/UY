import { motion } from "motion/react";
import { ArrowLeft, Upload, MapPin, DollarSign, Phone, AlertCircle } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { useState } from "react";

interface AddListingScreenProps {
  onBack: () => void;
  onSubmit: () => void;
}

export function AddListingScreen({ onBack, onSubmit }: AddListingScreenProps) {
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    price: "",
    location: "",
    description: "",
    phone: "",
    rooms: "",
    size: "",
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = () => {
    const newErrors: string[] = [];

    if (images.length < 3) {
      newErrors.push("Minimum 3 images required");
    }
    if (!formData.location) {
      newErrors.push("Location is required");
    }
    if (!formData.price) {
      newErrors.push("Price is required");
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      onSubmit();
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#121212]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0B1D3A]/95 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Add New Listing</h1>
            <p className="text-sm text-white/60">Create your property listing</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Errors */}
          {errors.length > 0 && (
            <GlassCard className="border-red-500/30 bg-red-500/10">
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-semibold">Please fix the following:</span>
                </div>
                <ul className="ml-7 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-300">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          )}

          {/* Image Upload */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">
              Property Images <span className="text-red-400">*</span>
              <span className="ml-2 text-white/60">(Minimum 3 required)</span>
            </label>
            <GlassCard>
              <div className="grid grid-cols-3 gap-3 p-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-xl border-2 border-dashed ${
                      images[index] ? "border-[#00D4FF]" : "border-white/20"
                    } flex items-center justify-center bg-white/5`}
                  >
                    {images[index] ? (
                      <img src={images[index]} alt="" className="h-full w-full rounded-xl object-cover" />
                    ) : (
                      <Upload className="h-8 w-8 text-white/40" />
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">
              Location <span className="text-red-400">*</span>
            </label>
            <GlassCard hover>
              <button className="flex w-full items-center gap-3 p-4">
                <MapPin className="h-5 w-5 text-[#00D4FF]" />
                <span className="text-white/60">Select location on map</span>
              </button>
            </GlassCard>
          </div>

          {/* Price */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">
              Price <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Enter price"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-white/40 outline-none transition-all focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/20"
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Bedrooms</label>
              <input
                type="number"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                placeholder="3"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition-all focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/20"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Size (m²)</label>
              <input
                type="number"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="150"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition-all focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/20"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your property..."
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition-all focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/20"
            />
          </div>

          {/* Phone */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">Contact Phone</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+998 90 123 45 67"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-white/40 outline-none transition-all focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/20"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fixed Bottom Submit */}
      <div className="border-t border-white/10 bg-[#0B1D3A]/95 backdrop-blur-xl p-6">
        <button
          onClick={handleSubmit}
          className="w-full rounded-xl bg-[#00D4FF] px-6 py-4 font-semibold text-black transition-all hover:bg-[#00D4FF]/90"
        >
          Submit Listing
        </button>
      </div>
    </div>
  );
}
