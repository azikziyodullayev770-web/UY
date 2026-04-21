import { Users, Home, Settings, LogOut, CheckCircle, XCircle, Brain, AlertCircle, Loader2, Clock, Check, X } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProperties } from "../context/PropertyContext";
import { moderateProperty, ModerationResult } from "../services/moderationService";
import { motion, AnimatePresence } from "motion/react";

interface AdminDashboardScreenProps {
  onLogout: () => void;
}

export function AdminDashboardScreen({ onLogout }: AdminDashboardScreenProps) {
  const { role } = useAuth();
  const { properties, updatePropertyStatus } = useProperties();
  const [moderatingId, setModeratingId] = useState<number | null>(null);
  const [moderationResults, setModerationResults] = useState<Record<number, ModerationResult>>({});

  const isModerator = role === "moderator";

  // Live data from PropertyContext
  const pendingProperties = properties.filter(p => p.status === "pending");
  const approvedProperties = properties.filter(p => p.status === "approved");
  const rejectedProperties = properties.filter(p => p.status === "rejected");

  const handleAIModeration = async (item: any) => {
    setModeratingId(item.id);
    const result = await moderateProperty({
      title: item.title || item.location,
      description: item.description || "Automated analysis of property listing",
      price: item.price,
      address: item.address || item.location,
      imageUrls: [],
    });
    setModerationResults((prev) => ({ ...prev, [item.id]: result }));
    setModeratingId(null);
  };

  const stats = [
    { title: "Faol E'lonlar", value: approvedProperties.length.toString(), icon: Home, color: "text-green-400", bg: "bg-green-500/10" },
    { title: "Kutmoqda", value: pendingProperties.length.toString(), icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10" },
    { title: "Rad etilgan", value: rejectedProperties.length.toString(), icon: X, color: "text-red-400", bg: "bg-red-500/10" },
    { title: "Jami foydalanuvchilar", value: "2,451", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
  ];

  return (
    <div className="h-full overflow-y-auto bg-slate-950 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Panel</h1>
            <p className="text-[10px] text-red-400 uppercase font-black tracking-[0.2em]">
              {role?.toUpperCase()} · Boshqaruv tizimi
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onLogout}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 transition-colors hover:bg-red-500/20"
          >
            <LogOut className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      <div className="space-y-8 px-6 py-6">
        {/* Stats Grid */}
        <section className="space-y-4">
          <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Statistika</h2>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <GlassCard key={i} className="border-white/5">
                  <div className="p-5 space-y-3">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">{stat.value}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">{stat.title}</p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* Pending Approvals */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">
              Tasdiqlash kutmoqda
            </h2>
            <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-1 rounded-lg font-black">
              {pendingProperties.length} ta
            </span>
          </div>

          {pendingProperties.length === 0 ? (
            <GlassCard className="border-white/5 p-8 text-center">
              <div className="flex flex-col items-center gap-3 text-slate-600">
                <Check className="w-10 h-10" />
                <p className="text-sm font-medium text-slate-400">Barcha e'lonlar ko'rib chiqildi</p>
              </div>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {pendingProperties.map((item) => (
                <div key={item.id} className="space-y-2">
                  <GlassCard className="border-white/5 overflow-hidden">
                    {/* Property Preview */}
                    <div className="flex gap-4 p-4">
                      <img
                        src={item.image}
                        alt={item.location}
                        className="w-20 h-20 rounded-2xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate text-sm">{item.location}</p>
                            <p className="text-xs text-slate-400">{item.region}, {item.district}</p>
                          </div>
                          <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-bold shrink-0">
                            Pending
                          </span>
                        </div>
                        <p className="text-lg font-black text-white">{item.price}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span>{item.rooms} xona</span>
                          <span>•</span>
                          <span>{item.size} m²</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-2 p-3 pt-0">
                      {/* AI Moderation */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAIModeration(item)}
                        disabled={moderatingId === item.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold transition-all hover:bg-blue-500/20 disabled:opacity-50"
                      >
                        {moderatingId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Brain className="h-4 w-4" />
                        )}
                        AI Tahlil
                      </motion.button>

                      <div className="flex-1" />

                      {/* Approve / Reject */}
                      {!isModerator && (
                        <>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updatePropertyStatus(item.id, "rejected")}
                            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold transition-all hover:bg-red-500/20"
                          >
                            <XCircle className="h-4 w-4" />
                            Rad
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updatePropertyStatus(item.id, "approved")}
                            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold transition-all hover:bg-green-500/20"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Tasdiqlash
                          </motion.button>
                        </>
                      )}
                    </div>

                    {/* Moderator warning */}
                    {isModerator && (
                      <div className="flex items-center gap-2 px-4 pb-3 text-[10px] text-slate-500">
                        <AlertCircle className="h-3 w-3" />
                        <span>Faqat moderator: Tasdiqlash tugmalari o'chirilgan</span>
                      </div>
                    )}
                  </GlassCard>

                  {/* AI Result */}
                  <AnimatePresence>
                    {moderationResults[item.id] && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      >
                        <GlassCard className={`border-l-4 ${
                          moderationResults[item.id].status === 'Approved'
                            ? 'border-l-green-500 bg-green-500/5'
                            : 'border-l-red-500 bg-red-500/5'
                        } border-white/5`}>
                          <div className="p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <Brain className="h-3 w-3" />
                                AI tahlil natijasi
                              </span>
                              <span className={`rounded-lg px-2 py-0.5 text-[10px] font-black uppercase ${
                                moderationResults[item.id].riskLevel === 'High'
                                  ? 'bg-red-500/20 text-red-400'
                                  : moderationResults[item.id].riskLevel === 'Medium'
                                  ? 'bg-orange-500/20 text-orange-400'
                                  : 'bg-green-500/20 text-green-400'
                              }`}>
                                Risk: {moderationResults[item.id].riskLevel}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-white">{moderationResults[item.id].status}</p>
                            <p className="mt-1 text-xs text-slate-400 leading-relaxed">{moderationResults[item.id].reason}</p>
                          </div>
                        </GlassCard>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* System Settings */}
        <section>
          <GlassCard className="border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4 p-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Settings className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="font-bold text-white">Tizim sozlamalari</p>
                <p className="text-xs text-slate-500">Ilovani boshqarish</p>
              </div>
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
