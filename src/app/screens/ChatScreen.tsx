import { motion } from "motion/react";
import { ArrowLeft, Send, Image, Shield } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { Badge } from "../components/Badge";
import { useState } from "react";

interface ChatScreenProps {
  onBack: () => void;
}

export function ChatScreen({ onBack }: ChatScreenProps) {
  const [message, setMessage] = useState("");
  const [view, setView] = useState<"list" | "detail">("list");

  const chats = [
    {
      id: 1,
      name: "FRANKLIN",
      verified: true,
      lastMessage: "MONEY?",
      time: "2m ago",
      unread: 2,
      avatar: "c:\Users\USER\Downloads\money-2-1024x597.webp",
    },
    {
      id: 2,
      name: "SENYOR AZIK",
      verified: true,
      lastMessage: "You the best ",
      time: "2h ago",
      unread: 0,
      avatar: "c:\Users\USER\OneDrive\Рисунки\Снимок экрана 2026-01-12 170407.png",
    },
  ];

  const messages = [
    { id: 1, text: "Hi! I'm interested in the property", sender: "other", time: "10:30 AM" },
    { id: 2, text: "Is it still available?", sender: "other", time: "10:31 AM" },
    { id: 3, text: "Yes, it's available! Would you like to schedule a viewing?", sender: "me", time: "10:35 AM" },
    { id: 4, text: "That would be great! When can we meet?", sender: "other", time: "10:36 AM" },
  ];

  if (view === "list") {
    return (
      <div className="flex h-full flex-col bg-[#121212]">
        {/* Header */}
        <div className="border-b border-white/10 bg-[#0B1D3A]/95 backdrop-blur-xl px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="text-sm text-white/60">Recent conversations</p>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
          <div className="space-y-3">
            {chats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover onClick={() => setView("detail")}>
                  <div className="flex items-center gap-4 p-4">
                    <div className="relative">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                      {chat.verified && (
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-[#00D4FF] p-1">
                          <Shield className="h-3 w-3 text-black" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white truncate">{chat.name}</h3>
                        <span className="text-xs text-white/60">{chat.time}</span>
                      </div>
                      <p className="text-sm text-white/60 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00D4FF]">
                        <span className="text-xs font-semibold text-black">{chat.unread}</span>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#121212]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0B1D3A]/95 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView("list")}
            className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <img
            src="c:\Users\USER\OneDrive\Рисунки\Снимок экрана 2026-01-12 170407.png"
            alt="User"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-white">Alex Johnson</h2>
              <Badge variant="verified">Verified</Badge>
            </div>
            <p className="text-xs text-[#00D4FF]">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[75%] space-y-1`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  msg.sender === "me"
                    ? "bg-[#00D4FF] text-black"
                    : "bg-white/10 text-white backdrop-blur-md"
                }`}
              >
                <p>{msg.text}</p>
              </div>
              <p className={`text-xs text-white/40 ${msg.sender === "me" ? "text-right" : ""}`}>
                {msg.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 bg-[#0B1D3A]/95 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center gap-3">
          <button className="rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20">
            <Image className="h-5 w-5 text-white" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition-all focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/20"
          />
          <button className="rounded-full bg-[#00D4FF] p-3 transition-colors hover:bg-[#00D4FF]/90">
            <Send className="h-5 w-5 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
