import { Home, Search, PlusCircle, MessageSquare, User, Crown } from "lucide-react";
import { motion } from "motion/react";

interface BottomNavProps {
  active: string;
  onNavigate: (screen: string) => void;
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const items = [
    { id: "home", icon: Home, label: "Home" },
    { id: "search", icon: Search, label: "Search" },
    { id: "add", icon: PlusCircle, label: "Add", special: true },
    { id: "top", icon: Crown, label: "Top", premium: true },
    { id: "chat", icon: MessageSquare, label: "Chat" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0B1D3A]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center gap-1 ${
                item.special ? "scale-110" : ""
              }`}
            >
              <div className="relative">
                {item.special && !isActive ? (
                  <div className="rounded-full bg-gradient-to-br from-[#00D4FF] to-[#0B1D3A] p-2">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                ) : (
                  <Icon
                    className={`h-6 w-6 transition-colors ${
                      isActive
                        ? item.premium
                          ? "text-[#FFD700]"
                          : "text-[#00D4FF]"
                        : "text-white/60"
                    }`}
                  />
                )}
                {isActive && !item.special && (
                  <motion.div
                    layoutId="active-nav"
                    className={`absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                      item.premium ? "bg-[#FFD700]" : "bg-[#00D4FF]"
                    }`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
              <span
                className={`text-xs ${
                  isActive
                    ? item.premium
                      ? "text-[#FFD700]"
                      : "text-[#00D4FF]"
                    : "text-white/60"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
