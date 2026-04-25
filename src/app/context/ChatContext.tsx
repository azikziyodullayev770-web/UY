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
  isTyping: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    participants: [
      { id: "demo-seller-1", name: "Jasur Komilov", photoURL: "https://i.pravatar.cc/150?u=jasur" }
    ],
    lastMessage: {
      id: "m-1",
      senderId: "demo-seller-1",
      text: "Assalomu alaykum! Uy bo'yicha savollaringiz bormi?",
      timestamp: Date.now() - 3600000,
      status: "seen"
    },
    unreadCount: 0
  },
  {
    id: "conv-2",
    participants: [
      { id: "demo-seller-2", name: "Senyorita", photoURL: "https://i.pravatar.cc/150?u=manzora" }
    ],
    lastMessage: {
      id: "m-2",
      senderId: "demo-seller-2",
      text: "Uy hali sotilmadi, kelsangiz ko'rsataman.",
      timestamp: Date.now() - 86400000,
      status: "seen"
    },
    unreadCount: 1
  }
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "m-0",
      senderId: "current-user",
      text: "Salom, e'lon bo'yicha yozayotgan edim.",
      timestamp: Date.now() - 7200000,
      status: "seen"
    },
    {
      id: "m-1",
      senderId: "demo-seller-1",
      text: "Assalomu alaykum! Uy bo'yicha savollaringiz bormi?",
      timestamp: Date.now() - 3600000,
      status: "seen"
    }
  ],
  "conv-2": [
    {
      id: "m-2",
      senderId: "demo-seller-2",
      text: "Uy hali sotilmadi, kelsangiz ko'rsataman.",
      timestamp: Date.now() - 86400000,
      status: "seen"
    }
  ]
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem("app_conversations");
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem("app_messages");
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

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
      setTimeout(() => setIsTyping(true), 1000);
      setTimeout(() => {
        setIsTyping(false);
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
            return { ...conv, lastMessage: reply };
          }
          return conv;
        }));
      }, 3000);
    }
  };

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

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversation,
      messages,
      setActiveConversation,
      sendMessage,
      archiveConversation,
      deleteConversation,
      isTyping
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
