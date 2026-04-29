import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  image?: string;
  category: "yangi" | "muhim" | "tadbir";
}

interface NewsContextType {
  news: NewsItem[];
  addNews: (news: Omit<NewsItem, "id" | "date">) => void;
  deleteNews: (id: number) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem("uyjoy_news");
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: "Ilovamiz yangilandi!",
        content: "Endi uylarni qidirish yanada oson va qulay bo'ldi. Yangi filtrlar va interfeys dizayni sizga ma'qul keladi degan umiddamiz.",
        date: new Date().toLocaleDateString(),
        category: "yangi",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 2,
        title: "Qashqadaryo bo'ylab ko'chmas mulk",
        content: "Viloyatimizning barcha tumanlaridan eng sara e'lonlar endi bir joyda jamlangan. Biz bilan uyingizni tezroq toping.",
        date: new Date().toLocaleDateString(),
        category: "muhim"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("uyjoy_news", JSON.stringify(news));
  }, [news]);

  const addNews = (item: Omit<NewsItem, "id" | "date">) => {
    const newItem: NewsItem = {
      ...item,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
    };
    setNews([newItem, ...news]);
  };

  const deleteNews = (id: number) => {
    setNews(news.filter((n) => n.id !== id));
  };

  return (
    <NewsContext.Provider value={{ news, addNews, deleteNews }}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(NewsContext);
  if (!context) throw new Error("useNews must be used within a NewsProvider");
  return context;
}
