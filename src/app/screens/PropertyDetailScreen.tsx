import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Heart, Share2, Phone, MessageCircle, MapPin, Bed, Maximize, Shield, ChevronRight, User, Star } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { Badge } from "../components/Badge";
import { PropertyCard } from "../components/PropertyCard";
import { useState, useEffect, useRef } from "react";
import { useProperties } from "../context/PropertyContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";

declare const ymaps: any;

interface PropertyDetailScreenProps {
  property: any;
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export function PropertyDetailScreen({ property, onNavigate, onBack }: PropertyDetailScreenProps) {
  const { favorites, toggleFavorite, properties } = useProperties();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [currentImage, setCurrentImage] = useState(0);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (property?.lat && property?.lng && mapContainerRef.current) {
      ymaps.ready(() => {
        try {
          const map = new ymaps.Map(mapContainerRef.current, {
            center: [property.lat, property.lng],
            zoom: 15,
            controls: [],
          });
          map.geoObjects.add(new ymaps.Placemark([property.lat, property.lng]));
          // Custom dark theme for map if possible, or just clean style
        } catch (e) {
          console.error("Map loading error", e);
        }
      });
    }
  }, [property]);

  if (!property) return null;

  const images = property.images && property.images.length > 0 ? property.images : [property.image];
  const isFavorite = favorites.includes(property.id);

  const similarListings = properties
    .filter(p => p.id !== property.id && p.status === "approved" && (p.district === property.district || p.type === property.type))
    .slice(0, 4);

  return (
    <div className="h-full overflow-y-auto bg-background pb-40">
      {/* Premium Gallery Container */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={images[currentImage]}
            alt="Property"
            className="h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

        {/* Floating Controls */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-black/20 backdrop-blur-xl border border-black/10 dark:border-white/10 text-foreground"
          >
            <ArrowLeft className="h-6 w-6" />
          </motion.button>
          <div className="flex gap-3">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-black/20 backdrop-blur-xl border border-black/10 dark:border-white/10 text-foreground"
            >
              <Share2 className="h-5 w-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (!isAuthenticated) {
                  onNavigate("login", { ...property, action: "toggleFavorite" });
                  return;
                }
                toggleFavorite(property.id);
              }}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl backdrop-blur-xl border border-black/10 dark:border-white/10 transition-colors ${
                isFavorite ? "bg-red-500 text-foreground border-red-500/50" : "bg-black/20 text-foreground"
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
            </motion.button>
          </div>
        </div>

        {/* Page Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 px-6">
          {property.images?.map((_: string, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentImage ? "w-8 bg-cyan-400" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-8 relative z-10 space-y-8">
        {/* Info Header Card */}
        <GlassCard className="p-6 border-black/5 dark:border-white/5 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {property.isTop && <Badge variant="premium">{t("add.topTitle")}</Badge>}
                <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                  {property.type === "sale" ? t("add.sale") : t("add.rent")}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">4.9</span>
              </div>
            </div>

            <div className="space-y-1">
              {property.title && <h2 className="text-lg font-bold text-slate-300 mb-1">{property.title}</h2>}
              <h1 className="text-4xl font-black text-foreground tracking-tighter leading-none mb-1">
                {property.price}
              </h1>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4 text-cyan-500" />
                <p className="text-sm font-medium">{property.region}, {property.district}</p>
              </div>
            </div>

            {/* Micro Stats */}
            <div className="pt-4 flex items-center gap-6 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-cyan-400">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-foreground font-bold leading-none">{property.rooms}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black">{t("common.rooms")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-cyan-400">
                  <Maximize className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-foreground font-bold leading-none">{property.size} {t("common.m2")}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black">{t("common.size")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-cyan-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-foreground font-bold leading-none">{t("profile.verified")}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black">{t("profile.status")}</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Seller Profile */}
        <section className="space-y-4">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">{t("detail.seller")}</h3>
          <div className="flex items-center justify-between p-4 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                  <User className="w-6 h-6 text-foreground" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-foreground">{property.seller?.name || "Premium Broker"}</h4>
                <p className="text-xs text-muted-foreground">Platformada 2 yildan beri</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </div>
        </section>

        {/* Description */}
        <section className="space-y-4">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">{t("detail.description")}</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {property.description || "Toshkent shahrining markazida joylashgan ushbu ko'chmas mulk barcha qulayliklarga ega. Zamonaviy dizayn va sifatli qurilish materiallari ishlatilgan. Atrofida maktab, bog'cha va savdo majmualari mavjud."}
          </p>
        </section>

        {/* Map Preview */}
        {property.lat && property.lng && (
          <section className="space-y-4">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">{t("detail.map")}</h3>
            <div className="h-48 overflow-hidden rounded-3xl border border-black/5 dark:border-white/5 bg-card ring-1 ring-white/5">
              <div ref={mapContainerRef} className="h-full w-full grayscale contrast-125 opacity-70" />
            </div>
          </section>
        )}

        {/* Similar Listings */}
        {similarListings.length > 0 && (
          <section className="space-y-6 pb-20">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">{t("detail.similar")}</h3>
            <div className="grid grid-cols-1 gap-6">
              {similarListings.map((listing) => (
                <PropertyCard
                  key={listing.id}
                  {...listing}
                  isFavorite={favorites.includes(listing.id)}
                  onToggleFavorite={toggleFavorite}
                  onClick={() => onNavigate("detail", listing)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modern Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-black/5 dark:border-white/5 bg-background/90 backdrop-blur-2xl p-6 z-50">
        <div className="mx-auto flex max-w-md gap-4">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (!isAuthenticated) {
                onNavigate("login");
                return;
              }
              // In real app, this would trigger call/whatsapp
              console.log("Calling seller...");
            }}
            className="flex-1 h-14 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-center gap-3 text-foreground font-bold transition-all hover:bg-white/10"
          >
            <Phone className="h-5 w-5 text-cyan-400" />
            <span>{t("detail.call")}</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate("chat", property.seller)}
            className="flex-[1.5] h-14 rounded-2xl bg-white text-slate-950 flex items-center justify-center gap-3 font-black uppercase tracking-widest shadow-xl shadow-white/5"
          >
            <MessageCircle className="h-5 w-5" />
            <span>{t("profile.message")}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
