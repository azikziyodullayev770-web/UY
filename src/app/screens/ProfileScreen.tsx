import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Heart, Home, Settings, Globe, LogOut, Shield, ChevronRight, Bell, Wallet, MapPin, X, Moon, Sun } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { Badge } from "../components/Badge";
import { useAuth } from "../context/AuthContext";
import { useProperties } from "../context/PropertyContext";
import { useTranslation } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

interface ProfileScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onLanguageChange: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ onNavigate, onLanguageChange, onLogout }: ProfileScreenProps) {
  const { user } = useAuth();
  const { properties, favorites } = useProperties();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Filter properties by user ID
  const myListings = properties.filter(p => p.userId === user?.uid);
  const favoriteListings = properties.filter(p => favorites.includes(p.id));

  const dummyNotifications = [
    { id: 1, title: "Yangi xabar", description: "Sizning e'loningiz bo'yicha yangi xabar keldi.", time: "10 daqiqa oldin" },
    { id: 2, title: "E'lon tasdiqlandi", description: "Sizning e'loningiz muvaffaqiyatli tasdiqlandi.", time: "2 soat oldin" },
    { id: 3, title: "Tizim yangilanishi", description: "Ilovada yangi xususiyatlar qo'shildi.", time: "1 kun oldin" },
  ];

  const menuItems = [
    { icon: Globe, label: t("profile.language"), onClick: onLanguageChange },
    { icon: Bell, label: t("profile.notifications"), onClick: () => setShowNotifications(true) },
    { icon: Wallet, label: t("profile.balance"), onClick: () => handlePayment(12500), badge: "12,500 " + t("common.currency") },
    { icon: Settings, label: t("profile.settings"), onClick: () => setShowSettings(true) },
    { icon: LogOut, label: t("profile.logout"), onClick: onLogout, danger: true },
  ];

  const handlePayment = async (amount: number) => {
    try {
      // Calling the backend API (proxied via Vite)
      const response = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          userId: user?.uid,
        })
      });

      if (!response.ok) throw new Error("Payment request failed");

      const data = await response.json();
      
      if (data.payment_url) {
        console.log(`Redirecting to: ${data.payment_url}`);
        window.location.href = data.payment_url;
      }
    } catch (error) {
      console.error("Payment error:", error);
      // Fallback for demo if backend is not running
      const mockPaymentUrl = `https://checkout.paycom.uz/` + btoa(`m=64352f754a6c8e32900c6d94;ac.user_id=${user?.uid};a=${amount * 100}`);
      window.location.href = mockPaymentUrl;
    }
  };

  const userNameDisplay = user?.displayName ? user.displayName : "No name provided";

  return (
    <div className="h-full overflow-y-auto bg-background pb-32">
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
              <div className="h-full w-full rounded-[1.8rem] bg-card flex items-center justify-center -rotate-3 hover:rotate-0 transition-transform duration-500">
                <User className="h-12 w-12 text-foreground" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center border-4 border-slate-950 shadow-lg">
              <Shield className="h-4 w-4 text-slate-950" />
            </div>
          </div>
          
          <h1 className="text-3xl font-black text-foreground tracking-tight leading-none mb-1">
            {userNameDisplay}
          </h1>
          <Badge variant="premium" className="px-4 py-1.5 text-[10px] tracking-[0.2em] font-black italic">
            {user?.role?.toUpperCase() || "USER"}
          </Badge>
          
          <div className="mt-4 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-sm font-medium">{user?.phoneNumber || "+998 90 123 45 67"}</span>
          </div>
        </motion.div>
      </div>

      {/* Profile Content */}
      <div className="px-6 space-y-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <GlassCard 
            onClick={() => onNavigate("myListings")}
            className="p-5 flex flex-col items-center gap-2 border-black/5 dark:border-white/5 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-1">
              <Home className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-foreground leading-none">{myListings.length}</p>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{t("profile.myListings")}</p>
          </GlassCard>
          
          <GlassCard 
            onClick={() => onNavigate("favorites")}
            className="p-5 flex flex-col items-center gap-2 border-black/5 dark:border-white/5 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 mb-1">
              <Heart className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-foreground leading-none">{favoriteListings.length}</p>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{t("nav.favorites")}</p>
          </GlassCard>
        </div>

        {/* Menu Section */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">{t("profile.settings")}</h3>
          <GlassCard className="overflow-hidden border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 group">
            <div className="divide-y divide-white/5">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={index}
                    onClick={item.onClick}
                    whileTap={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    className={`flex w-full items-center justify-between p-5 transition-all ${
                      item.danger ? "text-red-400" : "text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        item.danger ? "bg-red-500/10" : "bg-black/5 dark:bg-white/5"
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
        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-black/10 dark:border-white/10 text-center">
          <p className="text-foreground font-bold mb-1">{t("profile.pro")}</p>
          <p className="text-xs text-muted-foreground mb-4 px-4">{t("profile.proDesc")}</p>
          <button className="w-full py-3 rounded-xl bg-white text-slate-950 font-black uppercase tracking-widest text-xs active:scale-95 transition-all">
            {t("profile.proMore")}
          </button>
        </div>
      </div>

      {/* Notifications Modal */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-card border-t sm:border border-black/10 dark:border-white/10 sm:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-background">
                <h2 className="text-lg font-bold text-foreground">{t("profile.notifications")}</h2>
                <button onClick={() => setShowNotifications(false)} className="p-2 rounded-full bg-black/5 dark:bg-white/5 text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto p-4 space-y-4">
                {dummyNotifications.map(notification => (
                  <div key={notification.id} className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-foreground text-sm">{notification.title}</h4>
                      <span className="text-[10px] text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-card border-t sm:border border-black/10 dark:border-white/10 sm:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-background">
                <h2 className="text-lg font-bold text-foreground">{t("profile.settings")}</h2>
                <button onClick={() => setShowSettings(false)} className="p-2 rounded-full bg-black/5 dark:bg-white/5 text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Theme Mode</h4>
                    <p className="text-xs text-muted-foreground">Toggle between Light and Dark themes</p>
                  </div>
                  <button 
                    onClick={toggleTheme}
                    className="w-14 h-8 rounded-full bg-black/10 dark:bg-white/10 relative flex items-center p-1 transition-colors"
                  >
                    <motion.div 
                      layout
                      className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white"
                      style={{ marginLeft: theme === 'dark' ? 'auto' : 0 }}
                    >
                      {theme === 'dark' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                    </motion.div>
                  </button>
                </div>

                <div className="h-px bg-white/5" />

                <div className="space-y-4">
                  <h4 className="font-bold text-foreground text-sm">Hamyon</h4>
                  <button 
                    onClick={() => handlePayment(12500)}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/20 active:scale-95 transition-all"
                  >
                    <Wallet className="w-4 h-4" />
                    Balans va To‘lovlar
                  </button>
                  <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-black">Payme / Click orqali to‘lov</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
