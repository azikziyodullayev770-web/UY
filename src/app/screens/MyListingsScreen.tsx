import { motion } from "motion/react";
import { ArrowLeft, Edit, Trash2, Home, MapPin, Eye, CheckCircle2, Clock, AlertCircle, Star } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { useProperties, Property } from "../context/PropertyContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";
import { useState } from "react";

interface MyListingsScreenProps {
  onBack: () => void;
  onEdit: (property: Property) => void;
}

export function MyListingsScreen({ onBack, onEdit }: MyListingsScreenProps) {
  const { properties, deleteProperty, updatePropertyStatus } = useProperties();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const myListings = properties.filter(p => p.userId === user?.uid);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "active": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "pending": return <Clock className="w-4 h-4 text-orange-500" />;
      case "draft": return <Clock className="w-4 h-4 text-amber-500" />;
      case "rejected": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "sold": return <Home className="w-4 h-4 text-slate-500" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "active": return "text-green-500 bg-green-500/10";
      case "pending": return "text-orange-500 bg-orange-500/10";
      case "draft": return "text-amber-500 bg-amber-500/10";
      case "rejected": return "text-red-500 bg-red-500/10";
      case "sold": return "text-muted-foreground bg-slate-400/10";
      default: return "text-muted-foreground bg-slate-400/10";
    }
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setTimeout(() => {
      deleteProperty(id);
      setDeletingId(null);
    }, 500);
  };

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 py-8 flex items-center gap-4 bg-background/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-black text-foreground tracking-tight">{t("profile.myListings")}</h1>
          <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">{myListings.length} e'lonlar</p>
        </div>
      </div>

      {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {myListings.length === 0 ? (
            <div className="md:col-span-2 h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-black/10 dark:border-white/10">
                <Home className="w-10 h-10 text-slate-700" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight">E'lonlar yo'q</h3>
                <p className="text-sm text-slate-500 px-10">Siz hali birorta ham e'lon joylamagansiz.</p>
              </div>
            </div>
          ) : (
            myListings.map((listing) => (
              <motion.div
                key={listing.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={deletingId === listing.id ? "opacity-50 grayscale" : ""}
              >
                <GlassCard className="overflow-hidden border-black/5 dark:border-white/5 group h-full flex flex-col">
                  <div className="flex gap-4 p-4 flex-1">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-black/5 dark:border-white/5 relative">
                      <img src={listing.image} alt="" className="w-full h-full object-cover" />
                      {listing.isTop && (
                        <div className="absolute top-1 left-1 bg-cyan-500 p-1 rounded-lg">
                          <Star className="w-3 h-3 text-slate-950 fill-current" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(listing.status)}`}>
                            {getStatusIcon(listing.status)}
                            <span className="text-[8px] font-black uppercase tracking-widest">{listing.status}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold tracking-wider">{new Date(listing.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-[10px] font-bold text-muted-foreground truncate tracking-tight">{listing.title || "No Title"}</h4>
                        <h4 className="text-lg font-black text-foreground truncate tracking-tight">{listing.price}</h4>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-3 h-3 text-cyan-500" />
                          <span className="text-[10px] font-bold uppercase tracking-widest truncate">{listing.district}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-4 py-3 bg-black/5 dark:bg-white/5 flex items-center justify-between border-t border-black/5 dark:border-white/5 mt-auto">
                    <div className="flex gap-4">
                      <button className="flex items-center gap-1.5 text-muted-foreground hover:text-cyan-400 transition-colors">
                        <Eye className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">128</span>
                      </button>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onEdit(listing)}
                        className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-foreground hover:bg-cyan-500 hover:text-slate-950 transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {(listing.status === "active" || listing.status === "approved") && (
                        <button 
                          onClick={() => updatePropertyStatus(listing.id, "sold")}
                          className="px-4 h-10 rounded-xl bg-black/5 dark:bg-white/5 text-muted-foreground text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                          Sotildi
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(listing.id)}
                        className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-foreground transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
    </div>
  );
}
