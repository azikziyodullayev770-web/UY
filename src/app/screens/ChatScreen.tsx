import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Send, Image, MoreHorizontal, CheckCheck } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { useState } from "react";
import { useTranslation } from "../context/LanguageContext";

interface ChatScreenProps {
  onBack: () => void;
}

export function ChatScreen({ onBack }: ChatScreenProps) {
  const [message, setMessage] = useState("");
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const { t } = useTranslation();

  const chats = [
    {
      id: 1,
      name: "Soliqov Azizbek",
      verified: true,
      lastMessage: "Narxi bo'yicha kelishsak bo'ladimi?",
      time: "2 daq avval",
      unread: 2,
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Premium Broker",
      verified: true,
      lastMessage: "Ertaga ko'rishimiz mumkin.",
      time: "2 soat avval",
      unread: 0,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
  ];

  const messages = [
    { id: 1, text: "Assalomu alaykum! E'lon bo'yicha yozayotgan edim.", sender: "other", time: "10:30" },
    { id: 2, text: "Hali ham sotuvdami?", sender: "other", time: "10:31" },
    { id: 3, text: "Vaalaykum assalom! Ha, sotuvda. Qachon ko'rishni xohlaysiz?", sender: "me", time: "10:35" },
    { id: 4, text: "Ertaga tushlikdan keyin qulay bo'ladi.", sender: "other", time: "10:36" },
  ];

  if (view === "list") {
    return (
      <div className="flex h-full flex-col bg-slate-950">
        {/* Header */}
        <div className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl px-6 py-6 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white transition-all active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{t("nav.chat")}</h1>
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest leading-none">{t("profile.message")}</p>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 space-y-4">
          <AnimatePresence>
            {chats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard 
                  onClick={() => {
                    setSelectedChat(chat);
                    setView("detail");
                  }} 
                  className="border-white/5 bg-white/5 hover:bg-white/10 cursor-pointer group"
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className="relative">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="h-14 w-14 rounded-[1.2rem] object-cover border border-white/10 group-hover:scale-105 transition-transform"
                      />
                      {chat.verified && (
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-cyan-500 p-1 border-2 border-slate-950 shadow-lg">
                          <CheckCheck className="h-3 w-3 text-slate-950" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-white truncate">{chat.name}</h3>
                        <span className="text-[10px] text-slate-500 uppercase font-black">{chat.time}</span>
                      </div>
                      <p className="text-sm text-slate-400 truncate font-medium">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-cyan-500 shadow-lg shadow-cyan-500/20">
                        <span className="text-[10px] font-black text-slate-950">{chat.unread}</span>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-slate-950">
      {/* Header */}
      <div className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => setView("list")}
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white transition-all active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="relative">
          <img
            src={selectedChat?.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop"}
            alt="User"
            className="h-10 w-10 rounded-xl object-cover"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-white truncate">{selectedChat?.name || t("profile.guestUser")}</h2>
          </div>
          <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Online</p>
        </div>
        <button className="p-2 text-slate-500 hover:text-white">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scroll-smooth">
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] space-y-1`}>
              <div
                className={`rounded-[1.5rem] px-5 py-3.5 shadow-xl ${
                  msg.sender === "me"
                    ? "bg-white text-slate-950 rounded-tr-none shadow-white/5"
                    : "bg-white/5 text-white border border-white/10 rounded-tl-none backdrop-blur-sm shadow-black/20"
                }`}
              >
                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
              </div>
              <div className={`flex items-center gap-1 mt-1 ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{msg.time}</span>
                {msg.sender === "me" && <CheckCheck className="w-3 h-3 text-cyan-500" />}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-slate-950/80 backdrop-blur-2xl border-t border-white/5">
        <div className="flex items-center gap-3">
          <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-slate-400 border border-white/10 hover:text-white transition-all">
            <Image className="h-5 w-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("profile.chatPlaceholder")}
              className="w-full h-12 pl-5 pr-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 active:scale-90 transition-all">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
