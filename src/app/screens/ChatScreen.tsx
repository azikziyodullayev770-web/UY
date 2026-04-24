import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Send, Image, MoreHorizontal, CheckCheck, 
  Search, Archive, Trash2, MoreVertical
} from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "../context/LanguageContext";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

interface ChatScreenProps {
  onBack: () => void;
}

export function ChatScreen({ onBack }: ChatScreenProps) {
  const { 
    conversations, activeConversation, messages, 
    setActiveConversation, sendMessage, archiveConversation, 
    deleteConversation, isTyping 
  } = useChat();
  
  const { user } = useAuth();
  const { t } = useTranslation();
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOptions, setShowOptions] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeConversation) scrollToBottom();
  }, [messages, activeConversation, isTyping]);

  const filteredConversations = conversations.filter(conv => 
    !conv.isArchived && 
    conv.participants[0].name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConvData = conversations.find(c => c.id === activeConversation);
  const activeMessages = activeConversation ? messages[activeConversation] || [] : [];

  const handleSend = () => {
    if (inputText.trim() && activeConversation) {
      sendMessage(activeConversation, inputText);
      setInputText("");
    }
  };

  const handleImageSend = () => {
    if (activeConversation) {
      const mockImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";
      sendMessage(activeConversation, "Rasm yuborildi", mockImage);
    }
  };

  if (!activeConversation) {
    return (
      <div className="flex h-full flex-col bg-background">
        {/* Header */}
        <div className="bg-background/80 backdrop-blur-xl px-6 pt-8 pb-6 space-y-6 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-foreground tracking-tight">{t("nav.chat")}</h1>
              <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">{conversations.length} suhbatlar</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qidiruv..."
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground text-sm outline-none focus:border-cyan-500/50 transition-all"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 space-y-4">
          <AnimatePresence>
            {filteredConversations.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-600">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">Suhbatlar topilmadi</p>
              </div>
            ) : (
              filteredConversations.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard 
                    onClick={() => setActiveConversation(chat.id)} 
                    className="border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 hover:bg-white/10 cursor-pointer group relative"
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div className="relative">
                        <img
                          src={chat.participants[0].photoURL}
                          alt={chat.participants[0].name}
                          className="h-14 w-14 rounded-[1.2rem] object-cover border border-black/10 dark:border-white/10 group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-cyan-500 p-1 border-2 border-slate-950 shadow-lg">
                          <CheckCheck className="h-3 w-3 text-slate-950" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-foreground truncate">{chat.participants[0].name}</h3>
                          <span className="text-[10px] text-slate-500 uppercase font-black">
                            {new Date(chat.lastMessage?.timestamp || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate font-medium">{chat.lastMessage?.text}</p>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowOptions(showOptions === chat.id ? null : chat.id);
                        }}
                        className="p-2 text-slate-600 hover:text-foreground"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {chat.unreadCount > 0 && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-cyan-500 shadow-lg shadow-cyan-500/20 ml-2">
                          <span className="text-[10px] font-black text-slate-950">{chat.unreadCount}</span>
                        </div>
                      )}
                    </div>

                    {/* Options Popover */}
                    <AnimatePresence>
                      {showOptions === chat.id && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute right-4 top-14 z-20 bg-card border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl p-2 min-w-[140px]"
                        >
                          <button 
                            onClick={(e) => { e.stopPropagation(); archiveConversation(chat.id); setShowOptions(null); }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
                          >
                            <Archive className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Arxivlash</span>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteConversation(chat.id); setShowOptions(null); }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">O'chirish</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                </motion.div>
              )))}
            </AnimatePresence>
          </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Detail Header */}
      <div className="bg-background/80 backdrop-blur-xl px-6 py-4 flex items-center gap-4 border-b border-black/5 dark:border-white/5">
        <button
          onClick={() => setActiveConversation(null)}
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="relative">
          <img
            src={activeConvData?.participants[0].photoURL}
            alt="User"
            className="h-10 w-10 rounded-xl object-cover"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-foreground truncate">{activeConvData?.participants[0].name}</h2>
          <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
            {isTyping ? "Yozmoqda..." : "Online"}
          </p>
        </div>
        <button className="p-2 text-slate-500 hover:text-foreground">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scroll-smooth">
        {activeMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`flex ${msg.senderId === user?.uid ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] space-y-1`}>
              {msg.image && (
                <div className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 mb-2">
                  <img src={msg.image} alt="" className="w-full h-auto" />
                </div>
              )}
              <div
                className={`rounded-[1.5rem] px-5 py-3.5 shadow-xl ${
                  msg.senderId === user?.uid
                    ? "bg-white text-slate-950 rounded-tr-none shadow-white/5"
                    : "bg-black/5 dark:bg-white/5 text-foreground border border-black/10 dark:border-white/10 rounded-tl-none backdrop-blur-sm shadow-black/20"
                }`}
              >
                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
              </div>
              <div className={`flex items-center gap-1 mt-1 ${msg.senderId === user?.uid ? "justify-end" : "justify-start"}`}>
                <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.senderId === user?.uid && (
                  <CheckCheck className={`w-3 h-3 ${msg.status === "seen" ? "text-cyan-500" : "text-slate-600"}`} />
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="bg-black/5 dark:bg-white/5 rounded-2xl px-4 py-3 flex gap-1 items-center border border-black/10 dark:border-white/10">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-background/80 backdrop-blur-2xl border-t border-black/5 dark:border-white/5">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleImageSend}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 text-muted-foreground border border-black/10 dark:border-white/10 hover:text-foreground transition-all active:scale-90"
          >
            <Image className="h-5 w-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder={t("profile.chatPlaceholder")}
              className="w-full h-12 pl-5 pr-12 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 active:scale-90 transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
