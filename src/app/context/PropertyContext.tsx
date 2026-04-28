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
    // This handles cleaning up old localStorage data from other regions
    parsed = parsed.filter(p => p.region === "Qashqadaryo");
    
    // Ensure all combined properties (including dummyData) are present
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

  const addProperty = (newProp: Omit<Property, "id" | "status" | "createdAt" | "region" | "userId">) => {
    const property: Property = {
      ...newProp,
      id: Date.now(),
      userId: user?.uid || "guest",
      status: "pending",
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
