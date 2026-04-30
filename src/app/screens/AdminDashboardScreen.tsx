import { Home, LogOut, CheckCircle, XCircle, Brain, Loader2, Clock, X, Megaphone, Trash2, Pencil, ArrowLeft, MapPin, Bed, Maximize, Phone, User } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProperties } from "../context/PropertyContext";
import { useNews, NewsItem } from "../context/NewsContext";
import { moderateProperty, ModerationResult } from "../services/moderationService";
import { motion, AnimatePresence } from "motion/react";

interface AdminDashboardScreenProps {
  onLogout: () => void;
  onNavigate?: (screen: string, data?: any) => void;
}

type DashboardView = "main" | "approved" | "pending" | "rejected" | "news";

export function AdminDashboardScreen({ onLogout, onNavigate }: AdminDashboardScreenProps) {
  const { role } = useAuth();
  const { properties, updatePropertyStatus, deleteProperty } = useProperties();
  const { news, addNews, deleteNews } = useNews();

  const [moderatingId, setModeratingId] = useState<number | null>(null);
  const [moderationResults, setModerationResults] = useState<Record<number, ModerationResult>>({});
  const [currentView, setCurrentView] = useState<DashboardView>("main");
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [newNews, setNewNews] = useState({ title: "", content: "", category: "yangi" as NewsItem["category"] });

  const canManage = role === "superadmin" || role === "admin";

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

  const handleDeleteProperty = (id: number) => {
    if (confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
      deleteProperty(id);
    }
  };

  const pendingProperties = properties.filter(p => p.status === "pending");
  const approvedProperties = properties.filter(p => p.status === "approved");
  const rejectedProperties = properties.filter(p => p.status === "rejected");

  const stats = [
    { id: "approved", title: "Faol E'lonlar", value: approvedProperties.length.toString(), icon: Home, color: "text-green-400", bg: "bg-green-500/10" },
    { id: "pending", title: "Kutmoqda", value: pendingProperties.length.toString(), icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10" },
    { id: "rejected", title: "Rad etilgan", value: rejectedProperties.length.toString(), icon: X, color: "text-red-400", bg: "bg-red-500/10" },
    { id: "news", title: "Yangiliklar", value: news.length.toString(), icon: Megaphone, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  const renderListingItem = (item: any) => (
    <GlassCard key={item.id} className="border-black/5 dark:border-white/5 overflow-hidden">
      <div
        className="flex gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setSelectedListing(item)}
      >
        <img
          src={item.image}
          alt={item.title || item.location}
          className="w-20 h-20 rounded-2xl object-cover shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNXyKMzyEQPeK7o_TUyOZ19I_-2pGfvvWbTWNALvnQYw&s=10";
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-bold text-foreground text-sm truncate">{item.title || item.location}</p>
            {item.status === 'pending' && <span className="text-[8px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest">Pending</span>}
            {item.status === 'rejected' && <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest">Rejected</span>}
          </div>
          <p className="text-xs text-muted-foreground truncate">{item.region}, {item.district}</p>
          <p className="text-base font-black text-foreground mt-1">{item.price}</p>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
            <span>{item.rooms} xona</span>
            <span>•</span>
            <span>{item.size} m²</span>
            <span>•</span>
            <span className="uppercase">{item.type === "sale" ? "Sotish" : "Ijara"}</span>
          </div>
        </div>
        {canManage && onNavigate ? (
          <button 
            onClick={(e) => { e.stopPropagation(); onNavigate("edit", item); }}
            className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-slate-600 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors shrink-0 self-start"
          >
            <Pencil className="h-4 w-4" />
          </button>
        ) : (
          <Pencil className="h-4 w-4 text-slate-600 shrink-0 self-start mt-1" />
        )}
      </div>

      <div className="flex items-center gap-2 px-4 pb-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleAIModeration(item)}
          disabled={moderatingId === item.id}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold transition-all hover:bg-blue-500/20 disabled:opacity-50"
        >
          {moderatingId === item.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Brain className="h-3 w-3" />}
          AI
        </motion.button>

        <div className="flex-1" />

        {canManage && (
          <div className="flex gap-2">
            {item.status !== 'approved' && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); updatePropertyStatus(item.id, "approved"); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold transition-all hover:bg-green-500/20"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Tasdiqlash
              </motion.button>
            )}
            {item.status !== 'pending' && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); updatePropertyStatus(item.id, "pending"); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-bold transition-all hover:bg-orange-500/20"
              >
                <XCircle className="h-3.5 w-3.5" />
                To'xtatish
              </motion.button>
            )}
            {item.status !== 'rejected' && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); updatePropertyStatus(item.id, "rejected"); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold transition-all hover:bg-red-500/20"
              >
                <XCircle className="h-3.5 w-3.5" />
                Rad etish
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); handleDeleteProperty(item.id); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/10 text-red-500 border border-red-600/20 text-[10px] font-bold transition-all hover:bg-red-600/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {moderationResults[item.id] && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="px-4 pb-4">
            <div className={`p-3 rounded-xl border ${moderationResults[item.id].status === 'Approved' ? 'bg-green-500/5 border-green-500/20 text-green-400' : 'bg-red-500/5 border-red-500/20 text-red-400'} text-[10px]`}>
              <p className="font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Brain className="w-3 h-3"/> AI MODERATSIYA</p>
              <p className="font-bold">{moderationResults[item.id].reason}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );

  return (
    <div className="h-full overflow-y-auto bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-black/5 dark:border-white/5 bg-background/80 backdrop-blur-xl px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentView !== "main" && (
              <button
                onClick={() => setCurrentView("main")}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 text-slate-500 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-black text-foreground tracking-tight">Admin Panel</h1>
              <p className="text-[10px] text-red-400 uppercase font-black tracking-[0.2em]">
                {role?.toUpperCase()} · Boshqaruv
              </p>
            </div>
          </div>
          <div className="flex gap-2">
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
          {/* ── MAIN DASHBOARD ── */}
          {currentView === "main" && (
            <motion.div key="main" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Statistika</h2>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <GlassCard
                        key={stat.id}
                        className="border-black/5 dark:border-white/5 cursor-pointer hover:border-cyan-500/30 transition-all active:scale-95"
                        onClick={() => setCurrentView(stat.id as DashboardView)}
                      >
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

              {/* Quick Actions / Pending Preview */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">So'nggi so'rovlar</h2>
                  <button onClick={() => setCurrentView("pending")} className="text-[10px] text-cyan-400 font-black uppercase tracking-widest">Hammasi →</button>
                </div>
                <div className="space-y-3">
                  {pendingProperties.slice(0, 3).map(renderListingItem)}
                  {pendingProperties.length === 0 && (
                    <GlassCard className="p-8 text-center text-slate-500 text-sm font-medium border-dashed">
                      Hozircha yangi so'rovlar yo'q
                    </GlassCard>
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {/* ── APPROVED LISTINGS ── */}
          {currentView === "approved" && (
            <motion.div key="approved" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="text-[11px] font-black text-green-400 uppercase tracking-[0.3em]">Faol E'lonlar ({approvedProperties.length})</h2>
              <div className="space-y-3">
                {approvedProperties.map(renderListingItem)}
              </div>
            </motion.div>
          )}

          {/* ── PENDING LISTINGS ── */}
          {currentView === "pending" && (
            <motion.div key="pending" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="text-[11px] font-black text-orange-400 uppercase tracking-[0.3em]">Tasdiqlash kutilmoqda ({pendingProperties.length})</h2>
              <div className="space-y-3">
                {pendingProperties.map(renderListingItem)}
              </div>
            </motion.div>
          )}

          {/* ── REJECTED LISTINGS ── */}
          {currentView === "rejected" && (
            <motion.div key="rejected" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="text-[11px] font-black text-red-400 uppercase tracking-[0.3em]">Rad etilgan e'lonlar ({rejectedProperties.length})</h2>
              <div className="space-y-3">
                {rejectedProperties.map(renderListingItem)}
              </div>
            </motion.div>
          )}

          {/* ── NEWS MANAGER ── */}
          {currentView === "news" && (
            <motion.div key="news" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-[11px] font-black text-purple-400 uppercase tracking-[0.3em]">Yangiliklar boshqaruvi</h2>
              
              {canManage && (
                <GlassCard className="border-purple-500/20 bg-purple-500/5">
                  <form onSubmit={handleAddNews} className="p-5 space-y-4">
                    <input
                      type="text"
                      value={newNews.title}
                      onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                      placeholder="Sarlavha..."
                      className="w-full h-12 px-4 rounded-xl bg-black/5 border border-white/10 text-sm font-bold outline-none focus:border-purple-500/50"
                    />
                    <textarea
                      value={newNews.content}
                      onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                      placeholder="Mazmuni..."
                      className="w-full h-32 p-4 rounded-xl bg-black/5 border border-white/10 text-sm font-medium outline-none focus:border-purple-500/50"
                    />
                    <button type="submit" className="w-full h-12 rounded-xl bg-purple-500 text-white font-black uppercase tracking-widest text-[10px]">Qo'shish</button>
                  </form>
                </GlassCard>
              )}

              <div className="space-y-3">
                {news.map((item) => (
                  <GlassCard key={item.id} className="p-4 flex items-start justify-between gap-4 border-black/5">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase text-purple-400 tracking-widest">{item.category} • {item.date}</p>
                      <h3 className="font-bold text-foreground text-sm">{item.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.content}</p>
                    </div>
                    {canManage && (
                      <button onClick={() => deleteNews(item.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── PROPERTY DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedListing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6" onClick={() => setSelectedListing(null)}>
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="w-full max-w-lg bg-card border border-white/10 rounded-t-3xl md:rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative h-56 w-full">
                <img src={selectedListing.image} alt="" className="w-full h-full object-cover" />
                <button onClick={() => setSelectedListing(null)} className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-black/40 text-white flex items-center justify-center"><X className="h-5 w-5" /></button>
                {canManage && onNavigate && (
                  <button 
                    onClick={() => { setSelectedListing(null); onNavigate("edit", selectedListing); }} 
                    className="absolute top-4 right-16 w-10 h-10 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center transition-colors hover:bg-cyan-400 active:scale-95"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                )}
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <h2 className="text-xl font-black text-foreground">{selectedListing.title || selectedListing.location}</h2>
                  <p className="text-3xl font-black text-cyan-400 mt-1">{selectedListing.price}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-cyan-500" /><span>{selectedListing.region}, {selectedListing.district}</span></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-black/5 rounded-2xl p-3 text-center"><Bed className="h-5 w-5 text-cyan-400 mx-auto mb-1"/><p className="text-lg font-black text-foreground">{selectedListing.rooms}</p><p className="text-[10px] text-slate-500 uppercase font-black">Xona</p></div>
                  <div className="bg-black/5 rounded-2xl p-3 text-center"><Maximize className="h-5 w-5 text-cyan-400 mx-auto mb-1"/><p className="text-lg font-black text-foreground">{selectedListing.size}</p><p className="text-[10px] text-slate-500 uppercase font-black">m²</p></div>
                  <div className="bg-black/5 rounded-2xl p-3 text-center"><Home className="h-5 w-5 text-cyan-400 mx-auto mb-1"/><p className="text-[11px] font-black text-foreground uppercase">{selectedListing.propertyType}</p><p className="text-[10px] text-slate-500 uppercase font-black">Tur</p></div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedListing.description}</p>
                <div className="bg-black/5 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center"><User className="h-5 w-5 text-cyan-400" /></div>
                  <div className="flex-1"><p className="font-bold text-foreground text-sm">{selectedListing.sellerName}</p><p className="text-xs text-cyan-400 font-bold">{selectedListing.sellerPhone}</p></div>
                  <a href={`tel:${selectedListing.sellerPhone}`} className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center"><Phone className="h-4 w-4" /></a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
