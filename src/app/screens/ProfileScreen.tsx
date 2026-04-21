import { motion } from "motion/react";
import { User, Heart, Home, Settings, Globe, LogOut, Shield, ChevronRight, Bell, Wallet, MapPin } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { Badge } from "../components/Badge";
import { useAuth } from "../context/AuthContext";
import { useProperties } from "../context/PropertyContext";
import { useTranslation } from "../context/LanguageContext";

interface ProfileScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onLanguageChange: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ onNavigate, onLanguageChange, onLogout }: ProfileScreenProps) {
  const { user } = useAuth();
  const { properties, favorites } = useProperties();
  const { t } = useTranslation();

  // Mock data for user's own listings (in real app, filter by user phone/id)
  const myListings = properties.slice(0, 1);
  const favoriteListings = properties.filter(p => favorites.includes(p.id));

  const menuItems = [
    { icon: Globe, label: t("profile.language"), onClick: onLanguageChange },
    { icon: Bell, label: t("profile.notifications"), onClick: () => {} },
    { icon: Wallet, label: t("profile.balance"), onClick: () => {}, badge: "12,500 " + t("common.currency") },
    { icon: Settings, label: t("profile.settings"), onClick: () => {} },
    { icon: LogOut, label: t("profile.logout"), onClick: onLogout, danger: true },
  ];

  return (
    <div className="h-full overflow-y-auto bg-slate-950 pb-32">
      {/* Premium Header */}
      <div className="relative pt-16 pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/10 to-transparent -z-10" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="relative mb-6">
            <div className="h-28 w-28 rounded-[2rem] bg-gradient-to-br from-cyan-500 to-blue-600 p-1 rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-cyan-500/20">
              <div className="h-full w-full rounded-[1.8rem] bg-slate-900 flex items-center justify-center -rotate-3 hover:rotate-0 transition-transform duration-500">
                <User className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center border-4 border-slate-950 shadow-lg">
              <Shield className="h-4 w-4 text-slate-950" />
            </div>
          </div>
          
          <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">
            {user?.role === "superadmin" ? "Soliqov Azizbek" : t("profile.guestUser")}
          </h1>
          <Badge variant="premium" className="px-4 py-1.5 text-[10px] tracking-[0.2em] font-black italic">
            {user?.role?.toUpperCase() || "USER"}
          </Badge>
          
          <div className="mt-4 flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-sm font-medium">{user?.phoneNumber || "+998 90 123 45 67"}</span>
          </div>
        </motion.div>
      </div>

      {/* Profile Content */}
      <div className="px-6 space-y-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-5 flex flex-col items-center gap-2 border-white/5 active:scale-95 transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-1">
              <Home className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-white leading-none">{myListings.length}</p>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{t("profile.myListings")}</p>
          </GlassCard>
          
          <GlassCard 
            onClick={() => onNavigate("favorites")}
            className="p-5 flex flex-col items-center gap-2 border-white/5 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 mb-1">
              <Heart className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-white leading-none">{favoriteListings.length}</p>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{t("nav.favorites")}</p>
          </GlassCard>
        </div>

        {/* Menu Section */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">{t("profile.settings")}</h3>
          <GlassCard className="overflow-hidden border-white/5 bg-white/5 group">
            <div className="divide-y divide-white/5">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={index}
                    onClick={item.onClick}
                    whileTap={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    className={`flex w-full items-center justify-between p-5 transition-all ${
                      item.danger ? "text-red-400" : "text-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        item.danger ? "bg-red-500/10" : "bg-white/5"
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-bold tracking-tight">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.badge && (
                        <span className="text-[10px] bg-cyan-500 text-slate-950 px-2 py-1 rounded-lg font-black uppercase tracking-widest">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="h-5 w-5 text-slate-700" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>
        </section>

        {/* Info Tip */}
        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-white/10 text-center">
          <p className="text-white font-bold mb-1">{t("profile.pro")}</p>
          <p className="text-xs text-slate-400 mb-4 px-4">{t("profile.proDesc")}</p>
          <button className="w-full py-3 rounded-xl bg-white text-slate-950 font-black uppercase tracking-widest text-xs active:scale-95 transition-all">
            {t("profile.proMore")}
          </button>
        </div>
      </div>
    </div>
  );
}
