import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface Message {
  id: string;
  senderId: string;
  text: string;
  image?: string;
  timestamp: number;
  status: "sending" | "sent" | "delivered" | "seen";
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    photoURL?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  isArchived?: boolean;
}

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: Record<string, Message[]>;
  setActiveConversation: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string, image?: string) => void;
  archiveConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  typingConversations: Record<string, boolean>;
  markAsSeen: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    participants: [{ id: "u-1", name: "Alisher Karim", photoURL: "https://i.pravatar.cc/150?u=alisher" }],
    lastMessage: { id: "m-1", senderId: "u-1", text: "Uyni narxini ozroq tushirib berasizmi?", timestamp: Date.now() - 600000, status: "seen" },
    unreadCount: 0
  },
  {
    id: "conv-2",
    participants: [{ id: "u-2", name: "Madina opa", photoURL: "https://i.pravatar.cc/150?u=madina" }],
    lastMessage: { id: "m-2", senderId: "u-2", text: "Ertaga soat 10 da ko'rsata olasizmi?", timestamp: Date.now() - 3600000, status: "sent" },
    unreadCount: 2
  },
  {
    id: "conv-3",
    participants: [{ id: "u-3", name: "Shokir aka", photoURL: "https://i.pravatar.cc/150?u=shokir" }],
    lastMessage: { id: "m-3", senderId: "u-3", text: "Rahmat, uyni ko'rdik, yoqdi.", timestamp: Date.now() - 7200000, status: "seen" },
    unreadCount: 0
  },
  {
    id: "conv-4",
    participants: [{ id: "u-4", name: "Dilnoza", photoURL: "https://i.pravatar.cc/150?u=dilnoza" }],
    lastMessage: { id: "m-4", senderId: "u-4", text: "Yunusoboddagi uy hali sotilmadimi?", timestamp: Date.now() - 86400000, status: "seen" },
    unreadCount: 0
  },
  {
    id: "conv-5",
    participants: [{ id: "u-5", name: "Rustam", photoURL: "https://i.pravatar.cc/150?u=rustam" }],
    lastMessage: { id: "m-5", senderId: "u-5", text: "Lokatsiya tashlab bering iltimos.", timestamp: Date.now() - 172800000, status: "seen" },
    unreadCount: 0
  },
  {
    id: "conv-6",
    participants: [{ id: "u-6", name: "Sardor", photoURL: "https://i.pravatar.cc/150?u=sardor" }],
    lastMessage: { id: "m-6", senderId: "u-6", text: "Ipotekaga beriladimi?", timestamp: Date.now() - 259200000, status: "seen" },
    unreadCount: 0
  },
  {
    id: "conv-7",
    participants: [{ id: "u-7", name: "Guli", photoURL: "https://i.pravatar.cc/150?u=guli" }],
    lastMessage: { id: "m-7", senderId: "u-7", text: "Makler xizmati qancha?", timestamp: Date.now() - 345600000, status: "seen" },
    unreadCount: 0
  },
  {
    id: "conv-8",
    participants: [{ id: "u-8", name: "Azizbek", photoURL: "https://i.pravatar.cc/150?u=aziz" }],
    lastMessage: { id: "m-8", senderId: "u-8", text: "Yana rasmlari bormi?", timestamp: Date.now() - 432000000, status: "seen" },
    unreadCount: 0
  },
  {
    id: "conv-9",
    participants: [{ id: "u-9", name: "Laylo", photoURL: "https://i.pravatar.cc/150?u=laylo" }],
    lastMessage: { id: "m-9", senderId: "u-9", text: "Uy nechanchi qavatda?", timestamp: Date.now() - 518400000, status: "seen" },
    unreadCount: 0
  },
  {
    id: "conv-10",
    participants: [{ id: "u-10", name: "Nodir", photoURL: "https://i.pravatar.cc/150?u=nodir" }],
    lastMessage: { id: "m-10", senderId: "u-10", text: "Sotuvga boshqa uylar bormi?", timestamp: Date.now() - 604800000, status: "seen" },
    unreadCount: 0
  }
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  "conv-1": [{ id: "m-1", senderId: "u-1", text: "Uyni narxini ozroq tushirib berasizmi?", timestamp: Date.now() - 600000, status: "seen" }],
  "conv-2": [
    { id: "m-2-1", senderId: "current-user", text: "Salom, uy haqida so'ramoqchi edim.", timestamp: Date.now() - 4000000, status: "seen" },
    { id: "m-2", senderId: "u-2", text: "Ertaga soat 10 da ko'rsata olasizmi?", timestamp: Date.now() - 3600000, status: "sent" }
  ],
  "conv-3": [{ id: "m-3", senderId: "u-3", text: "Rahmat, uyni ko'rdik, yoqdi.", timestamp: Date.now() - 7200000, status: "seen" }],
  "conv-4": [{ id: "m-4", senderId: "u-4", text: "Yunusoboddagi uy hali sotilmadimi?", timestamp: Date.now() - 86400000, status: "seen" }],
  "conv-5": [{ id: "m-5", senderId: "u-5", text: "Lokatsiya tashlab bering iltimos.", timestamp: Date.now() - 172800000, status: "seen" }],
  "conv-6": [{ id: "m-6", senderId: "u-6", text: "Ipotekaga beriladimi?", timestamp: Date.now() - 259200000, status: "seen" }],
  "conv-7": [{ id: "m-7", senderId: "u-7", text: "Makler xizmati qancha?", timestamp: Date.now() - 345600000, status: "seen" }],
  "conv-8": [{ id: "m-8", senderId: "u-8", text: "Yana rasmlari bormi?", timestamp: Date.now() - 432000000, status: "seen" }],
  "conv-9": [{ id: "m-9", senderId: "u-9", text: "Uy nechanchi qavatda?", timestamp: Date.now() - 518400000, status: "seen" }],
  "conv-10": [{ id: "m-10", senderId: "u-10", text: "Sotuvga boshqa uylar bormi?", timestamp: Date.now() - 604800000, status: "seen" }]
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem("app_conversations");
    const parsed: Conversation[] = saved ? JSON.parse(saved) : [];
    const existingIds = new Set(parsed.map(c => c.id));
    const missing = INITIAL_CONVERSATIONS.filter(c => !existingIds.has(c.id));
    return [...parsed, ...missing];
  });

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem("app_messages");
    const parsed: Record<string, Message[]> = saved ? JSON.parse(saved) : {};
    return { ...INITIAL_MESSAGES, ...parsed };
  });

  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [typingConversations, setTypingConversations] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem("app_conversations", JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem("app_messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (conversationId: string, text: string, image?: string) => {
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: user?.uid || "guest",
      text,
      image,
      timestamp: Date.now(),
      status: "sent"
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, lastMessage: newMessage };
      }
      return conv;
    }));

    // Simulate reply
    if (!image) {
      setTimeout(() => setTypingConversations(prev => ({ ...prev, [conversationId]: true })), 1000);
      setTimeout(() => {
        setTypingConversations(prev => ({ ...prev, [conversationId]: false }));
        const reply: Message = {
          id: `m-reply-${Date.now()}`,
          senderId: "opponent",
          text: "Yaxshi, men ko'rib chiqib sizga javob beraman.",
          timestamp: Date.now(),
          status: "sent"
        };
        setMessages(prev => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), reply]
        }));
        setConversations(prev => prev.map(conv => {
          if (conv.id === conversationId) {
            return { ...conv, lastMessage: reply, unreadCount: conv.unreadCount + (activeConversation === conversationId ? 0 : 1) };
          }
          return conv;
        }));
      }, 3000);
    }
  };

  const markAsSeen = (id: string) => {
    setMessages(prev => {
      const convMessages = prev[id] || [];
      const hasUnseen = convMessages.some(m => m.senderId !== user?.uid && m.status !== "seen");
      if (!hasUnseen) return prev;
      
      return {
        ...prev,
        [id]: convMessages.map(m => 
          m.senderId !== user?.uid && m.status !== "seen" ? { ...m, status: "seen" as const } : m
        )
      };
    });
    setConversations(prev => prev.map(conv => {
      if (conv.id === id) {
        return { 
          ...conv, 
          unreadCount: 0,
          lastMessage: conv.lastMessage && conv.lastMessage.senderId !== user?.uid 
            ? { ...conv.lastMessage, status: "seen" } as Message
            : conv.lastMessage
        };
      }
      return conv;
    }));
  };

  useEffect(() => {
    if (activeConversation) {
      markAsSeen(activeConversation);
    }
  }, [activeConversation, messages]);

  const archiveConversation = (id: string) => {
    setConversations(prev => prev.map(conv => conv.id === id ? { ...conv, isArchived: true } : conv));
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    setMessages(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // Sorting by latest message timestamp
  const sortedConversations = [...conversations].sort((a, b) => {
    const timeA = a.lastMessage?.timestamp || 0;
    const timeB = b.lastMessage?.timestamp || 0;
    return timeB - timeA;
  });

  return (
    <ChatContext.Provider value={{
      conversations: sortedConversations,
      activeConversation,
      messages,
      setActiveConversation,
      sendMessage,
      archiveConversation,
      deleteConversation,
      typingConversations,
      markAsSeen
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
