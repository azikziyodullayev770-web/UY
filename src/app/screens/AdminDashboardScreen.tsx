import { Home, Settings, LogOut, CheckCircle, XCircle, Brain, AlertCircle, Loader2, Clock, Check, X, Megaphone, Trash2 } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProperties } from "../context/PropertyContext";
import { useNews, NewsItem } from "../context/NewsContext";
import { moderateProperty, ModerationResult } from "../services/moderationService";
import { motion, AnimatePresence } from "motion/react";

interface AdminDashboardScreenProps {
  onLogout: () => void;
}

export function AdminDashboardScreen({ onLogout }: AdminDashboardScreenProps) {
  const { role } = useAuth();
  const { properties, updatePropertyStatus, deleteProperty } = useProperties();
  const { news, addNews, deleteNews } = useNews();
  
  const [moderatingId, setModeratingId] = useState<number | null>(null);
  const [moderationResults, setModerationResults] = useState<Record<number, ModerationResult>>({});
  
  // News management states
  const [showNewsManager, setShowNewsManager] = useState(false);
  const [newNews, setNewNews] = useState({ title: "", content: "", category: "yangi" as NewsItem["category"] });

  const isModerator = role === "moderator";

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

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.title || !newNews.content) return;
    addNews(newNews);
    setNewNews({ title: "", content: "", category: "yangi" });
  };

  const pendingProperties = properties.filter(p => p.status === "pending");
  const approvedProperties = properties.filter(p => p.status === "approved");
  const rejectedProperties = properties.filter(p => p.status === "rejected");

  const stats = [
    { title: "Faol E'lonlar", value: approvedProperties.length.toString(), icon: Home, color: "text-green-400", bg: "bg-green-500/10" },
    { title: "Kutmoqda", value: pendingProperties.length.toString(), icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10" },
    { title: "Rad etilgan", value: rejectedProperties.length.toString(), icon: X, color: "text-red-400", bg: "bg-red-500/10" },
    { title: "Yangiliklar", value: news.length.toString(), icon: Megaphone, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="h-full overflow-y-auto bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-black/5 dark:border-white/5 bg-background/80 backdrop-blur-xl px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Admin Panel</h1>
            <p className="text-[10px] text-red-400 uppercase font-black tracking-[0.2em]">
              {role?.toUpperCase()} · Boshqaruv tizimi
            </p>
          </div>
          <div className="flex gap-2">
             <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNewsManager(!showNewsManager)}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all ${
                showNewsManager 
                  ? "bg-purple-500/20 text-purple-400 border-purple-500/40" 
                  : "bg-black/5 dark:bg-white/5 text-slate-500 border-transparent hover:bg-white/10"
              }`}
            >
              <Megaphone className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onLogout}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 transition-colors hover:bg-red-500/20"
            >
              <LogOut className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-6 py-6">
        <AnimatePresence mode="wait">
          {showNewsManager ? (
            <motion.section
              key="news-manager"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Yangiliklar boshqaruvi</h2>
                <button onClick={() => setShowNewsManager(false)} className="text-xs text-cyan-400 font-bold">Orqaga</button>
              </div>

              {/* Add News Form */}
              <GlassCard className="border-purple-500/20 bg-purple-500/5">
                <form onSubmit={handleAddNews} className="p-5 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Sarlavha</label>
                    <input
                      type="text"
                      value={newNews.title}
                      onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                      placeholder="Yangilik sarlavhasi..."
                      className="w-full h-12 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 text-sm font-bold outline-none focus:border-purple-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Mazmuni</label>
                    <textarea
                      value={newNews.content}
                      onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                      placeholder="Yangilik tafsilotlari..."
                      className="w-full h-32 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 text-sm font-medium outline-none focus:border-purple-500/50 resize-none"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Kategoriya</label>
                      <select
                        value={newNews.category}
                        onChange={(e) => setNewNews({ ...newNews, category: e.target.value as any })}
                        className="w-full h-12 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 text-sm font-bold outline-none focus:border-purple-500/50 appearance-none"
                      >
                        <option value="yangi">Yangi</option>
                        <option value="muhim">Muhim</option>
                        <option value="tadbir">Tadbir</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="h-12 px-6 rounded-xl bg-purple-500 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-purple-500/20"
                      >
                        Qo'shish
                      </motion.button>
                    </div>
                  </div>
                </form>
              </GlassCard>

              {/* News List */}
              <div className="space-y-3">
                {news.map((item) => (
                  <GlassCard key={item.id} className="border-black/5 dark:border-white/5">
                    <div className="p-4 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${
                            item.category === 'muhim' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {item.category}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold">{item.date}</span>
                        </div>
                        <h3 className="font-bold text-foreground">{item.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{item.content}</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteNews(item.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <section className="space-y-4">
                <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Statistika</h2>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <GlassCard key={i} className="border-black/5 dark:border-white/5">
                        <div className="p-5 space-y-3">
                          <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                            <Icon className={`h-5 w-5 ${stat.color}`} />
                          </div>
                          <div>
                            <p className="text-3xl font-black text-foreground">{stat.value}</p>
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
                  <GlassCard className="border-black/5 dark:border-white/5 p-8 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-600">
                      <Check className="w-10 h-10" />
                      <p className="text-sm font-medium text-muted-foreground">Barcha e'lonlar ko'rib chiqildi</p>
                    </div>
                  </GlassCard>
                ) : (
                  <div className="space-y-4">
                    {pendingProperties.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <GlassCard className="border-black/5 dark:border-white/5 overflow-hidden">
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
                                  <p className="font-bold text-foreground truncate text-sm">{item.title || item.location}</p>
                                  <p className="text-xs text-muted-foreground">{item.region}, {item.district}</p>
                                </div>
                                <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-bold shrink-0">
                                  Pending
                                </span>
                              </div>
                              <p className="text-lg font-black text-foreground">{item.price}</p>
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

                            {/* Approve / Reject / Delete */}
                            {!isModerator && (
                              <>
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => {
                                    if (confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
                                      deleteProperty(item.id);
                                    }
                                  }}
                                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold transition-all hover:bg-red-500/20"
                                >
                                  <X className="h-4 w-4" />
                                  O'chirish
                                </motion.button>
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => updatePropertyStatus(item.id, "rejected")}
                                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold transition-all hover:bg-orange-500/20"
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
                              } border-black/5 dark:border-white/5`}>
                                <div className="p-4">
                                  <div className="mb-2 flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
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
                                  <p className="text-sm font-bold text-foreground">{moderationResults[item.id].status}</p>
                                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{moderationResults[item.id].reason}</p>
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

              {/* System Settings Entry */}
              <section>
                <GlassCard 
                  onClick={() => setShowNewsManager(true)}
                  className="border-black/5 dark:border-white/5 cursor-pointer hover:bg-black/5 dark:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4 p-5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                      <Settings className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Tizim sozlamalari</p>
                      <p className="text-xs text-slate-500">Ilovani boshqarish va yangiliklar</p>
                    </div>
                  </div>
                </GlassCard>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
