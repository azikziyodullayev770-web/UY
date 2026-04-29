import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Property {
  id: number;
  userId: string; // To track ownership
  image: string;
  images: string[];
  title: string;
  price: string;
  location: string;
  region: string;
  district: string;
  address?: string;
  lat?: number;
  lng?: number;
  rooms: number;
  size: number;
  description?: string;
  type: "sale" | "rent";
  propertyType?: string;
  isTop?: boolean;
  topExpiresAt?: number; // Timestamp when TOP status expires
  status: "draft" | "active" | "sold" | "pending" | "approved" | "rejected";
  sellerName?: string;
  sellerPhone?: string;
  sellerTelegram?: string;
  createdAt: number;
}

interface PropertyContextType {
  properties: Property[];
  favorites: number[];
  addProperty: (property: Omit<Property, "id" | "status" | "createdAt" | "region" | "userId">) => void;
  updateProperty: (id: number, updates: Partial<Property>) => void;
  deleteProperty: (id: number) => void;
  updatePropertyStatus: (id: number, status: Property["status"]) => void;
  toggleFavorite: (id: number) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const INITIAL_PROPERTIES: Property[] = [];

import { realisticListings } from "./dummyData";
const COMBINED_PROPERTIES = [...INITIAL_PROPERTIES, ...realisticListings] as Property[];

import { useAuth } from "./AuthContext";

export function PropertyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem("app_properties");
    let parsed: Property[] = saved ? JSON.parse(saved) : [];
    
    // STRICT FILTER: Remove any properties that are not from Qashqadaryo
    parsed = parsed.filter(p => p.region === "Qashqadaryo");

    // FIX BROKEN IMAGE PATHS and update dummy data images in localStorage data
    parsed = parsed.map(p => {
      const dummyMatch = COMBINED_PROPERTIES.find(d => d.id === p.id);
      if (dummyMatch) {
        return {
          ...p,
          title: dummyMatch.title,
          image: dummyMatch.image,
          images: dummyMatch.images,
          isTop: dummyMatch.isTop !== undefined ? dummyMatch.isTop : p.isTop,
          topExpiresAt: dummyMatch.topExpiresAt !== undefined ? dummyMatch.topExpiresAt : p.topExpiresAt
        };
      }

      // FIX SPECIFIC BROKEN LISTINGS FROM SCREENSHOT (User's local data)
      if (p.price === "$120,000" && (!p.title || p.title === "")) {
        return {
          ...p,
          title: "Kitob shahar markazida hashamatli 5 xonali hovli",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
          images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"]
        };
      }
      if (p.price === "$110,000" && (!p.title || p.title === "")) {
        return {
          ...p,
          title: "Qarshi shahrida katta va keng 8 xonali hovli",
          image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80",
          images: ["https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80"]
        };
      }

      if (p.image && p.image.startsWith("/images/houses/")) {
        return {
          ...p,
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
          images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"]
        };
      }
      return p;
    });

    // Final safety check: Ensure TOP listings have unique images by injecting different Unsplash IDs if duplicates are found
    const topImages = new Set();
    const unsplashFallbacks = [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600566753190-17f0bcd2a6c4",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
      "https://images.unsplash.com/photo-1600585154542-6379b74b401c"
    ];

    parsed = parsed.map(p => {
      if (p.isTop && topImages.has(p.image)) {
        const nextImage = unsplashFallbacks.find(img => !topImages.has(img)) || p.image;
        topImages.add(nextImage);
        return { ...p, image: nextImage, images: [nextImage] };
      }
      if (p.isTop) topImages.add(p.image);
      return p;
    });
    
    // Ensure all combined properties (including fixed dummyData) are present
    const existingIds = new Set(parsed.map((p) => p.id));
    const missingProperties = COMBINED_PROPERTIES.filter((p) => !existingIds.has(p.id));
    
    return [...parsed, ...missingProperties];
  });

  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem("app_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("app_properties", JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem("app_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // AUTOMATIC ADOPTION: If a guest registers/logs in, assign their "guest" properties to their new UID
  useEffect(() => {
    if (user?.uid && user.uid !== "guest") {
      setProperties(prev => {
        const hasGuestProps = prev.some(p => p.userId === "guest");
        if (!hasGuestProps) return prev;
        
        console.info(`[PropertyContext] Adopting guest properties for user: ${user.uid}`);
        return prev.map(p => 
          p.userId === "guest" ? { ...p, userId: user.uid } : p
        );
      });
    }
  }, [user?.uid]);

  const addProperty = (newProp: Omit<Property, "id" | "status" | "createdAt" | "region" | "userId">) => {
    const property: Property = {
      ...newProp,
      id: Date.now(),
      userId: user?.uid || "guest",
      status: "approved", // Changed from pending so it shows up immediately
      createdAt: Date.now(),
      region: "Qashqadaryo"
    };
    setProperties((prev) => [property, ...prev]);
  };

  const updateProperty = (id: number, updates: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProperty = (id: number) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePropertyStatus = (id: number, status: Property["status"]) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // Memoized and sorted properties
  const sortedProperties = [...properties].sort((a, b) => {
    const now = Date.now();
    const aIsTopActive = a.isTop && (!a.topExpiresAt || a.topExpiresAt > now);
    const bIsTopActive = b.isTop && (!b.topExpiresAt || b.topExpiresAt > now);

    if (aIsTopActive && !bIsTopActive) return -1;
    if (!aIsTopActive && bIsTopActive) return 1;
    return b.createdAt - a.createdAt;
  });

  return (
    <PropertyContext.Provider value={{ 
      properties: sortedProperties, 
      favorites, 
      addProperty, 
      updateProperty,
      deleteProperty,
      updatePropertyStatus, 
      toggleFavorite 
    }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error("useProperties must be used within a PropertyProvider");
  }
  return context;
}
