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
      className="fixed inset-0 z-[100] flex flex-col bg-black"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-[#0B1D3A] p-4">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="rounded-full bg-white/10 p-2 text-foreground">
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-bold text-foreground">Select Location</h2>
        </div>
        <button
          onClick={handleConfirm}
          className="flex items-center gap-2 rounded-xl bg-[#00D4FF] px-4 py-2 font-semibold text-black"
        >
          <Check className="h-5 w-5" />
          Confirm
        </button>
      </div>

      {/* Map Content */}
      <div className="relative flex-1 bg-zinc-900">
        <div ref={mapContainerRef} className="h-full w-full" />
        
        {/* Fixed Center Pin */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="mb-10 flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MapPin className="h-10 w-10 text-red-500 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]" />
            </motion.div>
            <div className="h-2 w-2 rounded-full bg-black/40 blur-[2px]" />
          </div>
        </div>

        {/* Floating Address Bar */}
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <GlassCard className="bg-black/60 backdrop-blur-md">
            <div className="flex items-start gap-3 p-4">
              <div className="rounded-full bg-[#00D4FF]/10 p-2">
                <MapPin className="h-5 w-5 text-[#00D4FF]" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground/50 uppercase tracking-wider">Property Address</p>
                <p className="mt-1 text-sm text-foreground line-clamp-2">
                  {address}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {!isMapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0B1D3A]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-[#00D4FF]" />
              <p className="text-foreground/60">Initializing Map...</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
