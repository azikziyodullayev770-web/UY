import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { MapPin, X, Check, Loader2 } from "lucide-react";
import { GlassCard } from "./GlassCard";

declare const ymaps: any;

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

interface LocationPickerProps {
  onClose: () => void;
  onSelect: (data: LocationData) => void;
  initialLocation?: { lat: number; lng: number };
}

export function LocationPicker({ onClose, onSelect, initialLocation }: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [address, setAddress] = useState<string>("Detecting address...");
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(
    initialLocation || { lat: 38.8612, lng: 65.7847 } // Default Qarshi (Qashqadaryo)
  );
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    ymaps.ready(() => {
      if (!mapContainerRef.current) return;

      const map = new ymaps.Map(mapContainerRef.current, {
        center: [coords.lat, coords.lng],
        zoom: 15,
        controls: ["zoomControl", "fullscreenControl"],
      });

      mapRef.current = map;

      // Add a center pin behavior
      map.events.add("actionend", () => {
        const center = map.getCenter();
        const newCoords = { lat: center[0], lng: center[1] };
        setCoords(newCoords);
        reverseGeocode(newCoords);
      });

      setIsMapReady(true);
      reverseGeocode(coords);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
      }
    };
  }, []);

  const reverseGeocode = async (c: { lat: number; lng: number }) => {
    setAddress("Fetching address...");
    try {
      const res = await ymaps.geocode([c.lat, c.lng]);
      const firstGeoObject = res.geoObjects.get(0);
      const addr = firstGeoObject ? firstGeoObject.getAddressLine() : "Unknown location";
      setAddress(addr);
    } catch (e) {
      setAddress("Error detecting address");
    }
  };

  const handleConfirm = () => {
    onSelect({ ...coords, address });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col bg-[#0B1D3A]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-[#0B1D3A]/80 backdrop-blur-xl p-4">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="rounded-full bg-white/5 p-2 text-foreground hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-bold text-foreground tracking-tight">Joylashuvni tanlang</h2>
        </div>
        <button
          onClick={handleConfirm}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 font-black uppercase tracking-widest text-[10px] text-slate-950 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
        >
          <Check className="h-4 w-4" />
          Tasdiqlash
        </button>
      </div>

      {/* Map Content */}
      <div className="relative flex-1 bg-[#0F2645]">
        <div ref={mapContainerRef} className="h-full w-full" />
        
        {/* Fixed Center Pin */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="mb-10 flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="relative">
                <MapPin className="h-12 w-12 text-red-500 fill-red-500/20 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                <div className="absolute inset-0 flex items-center justify-center pb-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </motion.div>
            <div className="h-2 w-5 rounded-full bg-black/40 blur-[4px]" />
          </div>
        </div>

        {/* Floating Address Bar */}
        <div className="absolute bottom-10 left-0 right-0 px-6">
          <GlassCard className="bg-[#0B1D3A]/80 border-white/10 shadow-2xl">
            <div className="flex items-start gap-4 p-5">
              <div className="rounded-2xl bg-cyan-500/10 p-3 ring-1 ring-cyan-500/20">
                <MapPin className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.2em] mb-1">Tanlangan Manzil</p>
                <p className="text-sm font-bold text-foreground leading-tight">
                  {address}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {!isMapReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B1D3A] z-10">
            <div className="w-24 h-24 relative flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-cyan-400 z-10" />
              <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full animate-pulse" />
            </div>
            <p className="text-cyan-400/60 text-[10px] font-black uppercase tracking-[0.3em] mt-4 animate-pulse">Xaritani yuklash...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
