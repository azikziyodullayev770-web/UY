import { Home, Search, PlusCircle, MessageSquare, User, Heart } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "../context/LanguageContext";

interface BottomNavProps {
  active: string;
  onNavigate: (screen: string) => void;
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const { t } = useTranslation();
  
  const items = [
    { id: "home", icon: Home, label: t("nav.home") },
    { id: "search", icon: Search, label: t("nav.search") },
    { id: "add", icon: PlusCircle, label: t("nav.add"), special: true },
    { id: "favorites", icon: Heart, label: t("nav.favorites") },
    { id: "chat", icon: MessageSquare, label: t("nav.chat") },
    { id: "profile", icon: User, label: t("nav.profile") },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-slate-950/80 backdrop-blur-2xl px-2 pb-safe">
      <div className="mx-auto flex max-w-md items-center justify-around py-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center gap-1 flex-1 transition-all ${
                item.special ? "scale-110 -translate-y-1" : "active:scale-90"
              }`}
            >
              <div className="relative">
                {item.special ? (
                  <div className={`rounded-full shadow-lg transition-all ${
                    isActive 
                      ? "bg-white text-slate-950 shadow-white/20" 
                      : "bg-cyan-500 text-slate-950 shadow-cyan-500/20"
                  } p-2.5`}>
                    <Icon className="h-6 w-6" />
                  </div>
                ) : (
                  <Icon
                    className={`h-6 w-6 transition-colors duration-300 ${
                      isActive ? "text-cyan-400" : "text-slate-500"
                    }`}
                  />
                )}
                {isActive && !item.special && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
              {!item.special && (
                <span
                  className={`text-[10px] font-medium transition-colors duration-300 ${
                    isActive ? "text-white" : "text-slate-500"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
