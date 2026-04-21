import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Property {
  id: number;
  image: string;
  images?: string[];
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
  status: "pending" | "approved" | "rejected";
  sellerName?: string;
  sellerPhone?: string;
  sellerTelegram?: string;
  createdAt: number;
}

interface PropertyContextType {
  properties: Property[];
  favorites: number[];
  addProperty: (property: Omit<Property, "id" | "status" | "createdAt" | "region">) => void;
  updatePropertyStatus: (id: number, status: "approved" | "rejected") => void;
  toggleFavorite: (id: number) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const INITIAL_PROPERTIES: Property[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"],
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
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750"],
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
    image: "https://images.unsplash.com/photo-1580587767303-9cd919b3353c",
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
    status: "approved",
    type: "sale",
    description: "Kitob tumanida katta hovli sotiladi. 6 sotixli yer, mevali daraxtlari bor.",
    sellerName: "Bekzod aka",
    sellerPhone: "+998 99 888 77 66",
    createdAt: Date.now() - 172800000,
  }
];

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem("app_properties");
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
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

  const addProperty = (newProp: Omit<Property, "id" | "status" | "createdAt" | "region">) => {
    const property: Property = {
      ...newProp,
      id: Date.now(),
      status: "pending",
      createdAt: Date.now(),
      region: "Qashqadaryo"
    };
    setProperties((prev) => [property, ...prev]);
  };

  const updatePropertyStatus = (id: number, status: "approved" | "rejected") => {
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
    // Sort by isTop (boolean) first, then by createdAt (timestamp)
    if (a.isTop && !b.isTop) return -1;
    if (!a.isTop && b.isTop) return 1;
    return b.createdAt - a.createdAt;
  });

  return (
    <PropertyContext.Provider value={{ properties: sortedProperties, favorites, addProperty, updatePropertyStatus, toggleFavorite }}>
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
