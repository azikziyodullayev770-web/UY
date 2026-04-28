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

const INITIAL_PROPERTIES: Property[] = [
  {
    id: 1,
    userId: "admin-superadmin",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d"],
    title: "Markazdagi shinam kvartira",
    price: "$85,000",
    location: "Qarshi, Oydin",
    region: "Qashqadaryo",
    district: "Qarshi",
    address: "Islam Karimov ko'chasi, 24",
    rooms: 3,
    size: 85,
    lat: 38.8612,
    lng: 65.7847,
    isTop: true,
    topExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    status: "approved",
    type: "sale",
    propertyType: "apartment",
    description: "Qarshi shahar markazida shinam va barcha sharoitga ega 3 xonali kvartira. Maktab, bog'cha va park yaqin.",
    sellerName: "Jasur Komilov",
    sellerPhone: "+998 90 123 45 67",
    createdAt: Date.now() - 3600000,
  },
  {
    id: 2,
    userId: "demo-google-uid",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750", "https://images.unsplash.com/photo-1515263487990-61b07816b324", "https://images.unsplash.com/photo-1448630360428-6e238802eeaf", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"],
    title: "Shahrisabz markazida ijara",
    price: "$1,200,000 /oy",
    location: "Shahrisabz, Kesh",
    region: "Qashqadaryo",
    district: "Shahrisabz",
    address: "Amir Temur ko'chasi, 12",
    rooms: 2,
    size: 55,
    lat: 39.0573,
    lng: 66.8286,
    isTop: false,
    status: "approved",
    type: "rent",
    propertyType: "apartment",
    description: "Shahrisabz markazida ijaraga beriladigan 2 xonali uy. Evro remont.",
    sellerName: "Manozora opa",
    sellerPhone: "+998 97 765 43 21",
    createdAt: Date.now() - 86400000,
  },
  {
    id: 3,
    userId: "demo-phone-uid",
    image: "https://images.unsplash.com/photo-1580587767303-9cd919b3353c",
    images: ["https://images.unsplash.com/photo-1580587767303-9cd919b3353c", "https://images.unsplash.com/photo-1518780664697-55e3ad937233", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6", "https://images.unsplash.com/photo-1568605114967-8130f3a36994"],
    title: "Kitob tumanida katta hovli",
    price: "$120,000",
    location: "Kitob shahar",
    region: "Qashqadaryo",
    district: "Kitob",
    address: "Sohibqiron ko'chasi",
    rooms: 5,
    size: 200,
    lat: 39.1245,
    lng: 66.8643,
    isTop: true,
    topExpiresAt: Date.now() + 3 * 24 * 60 * 60 * 1000,
    status: "approved",
    type: "sale",
    description: "Kitob tumanida katta hovli sotiladi. 6 sotixli yer, mevali daraxtlari bor.",
    sellerName: "Bekzod aka",
    sellerPhone: "+998 99 888 77 66",
    createdAt: Date.now() - 172800000,
  }
];

import { realisticListings } from "./dummyData";
const COMBINED_PROPERTIES = [...INITIAL_PROPERTIES, ...realisticListings] as Property[];

import { useAuth } from "./AuthContext";

export function PropertyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem("app_properties");
    const parsed: Property[] = saved ? JSON.parse(saved) : [];
    
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
