import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// Screens
import { SplashScreen } from "./screens/SplashScreen";
import { LanguageScreen } from "./screens/LanguageScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { AdminLoginScreen } from "./screens/AdminLoginScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { SearchScreen } from "./screens/SearchScreen";
import { PropertyDetailScreen } from "./screens/PropertyDetailScreen";
import { MapScreen } from "./screens/MapScreen";
import { ChatScreen } from "./screens/ChatScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { AddListingScreen } from "./screens/AddListingScreen";
import { FavoritesScreen } from "./screens/FavoritesScreen";
import { MyListingsScreen } from "./screens/MyListingsScreen";

// Components
import { BottomNav } from "./components/BottomNav";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { PropertyProvider, Property } from "./context/PropertyContext.tsx";
import { AdminDashboardScreen } from "./screens/AdminDashboardScreen";

import { LanguageProvider, useTranslation } from "./context/LanguageContext";
import { ChatProvider } from "./context/ChatContext";
import { ThemeProvider } from "./context/ThemeContext";

type AppScreen = "splash" | "language" | "login" | "adminLogin" | "adminDashboard" | "home" | "search" | "detail" | "map" | "chat" | "profile" | "add" | "favorites" | "myListings" | "edit";

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("splash");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<AppScreen[]>([]);
  const [pendingAction, setPendingAction] = useState<{ screen: AppScreen; data?: Property } | null>(null);

  const { isAuthenticated, role, isInitialized, logout } = useAuth();
  const { setLanguage } = useTranslation();

  const handleNavigation = (screen: AppScreen, data?: Property) => {
    // Prevent normal users from navigating to adminDashboard manually
    const isAdmin = ["superadmin", "admin", "moderator"].includes(role || "");
    if (screen === "adminDashboard" && !isAdmin) return;

    // INTERCEPT: Protected screens for guest users
    const protectedScreens: AppScreen[] = ["add", "chat", "favorites", "myListings", "edit"];
    if (!isAuthenticated && protectedScreens.includes(screen)) {
      setPendingAction({ screen, data });
      setCurrentScreen("login");
      return;
    }

    setNavigationHistory(prev => [...prev, currentScreen]);

    if (data !== undefined) {
      setSelectedProperty(data);
    } else if (screen !== "detail") {
      setSelectedProperty(null);
    }

    setCurrentScreen(screen);
  };

  const handleBack = () => {
    if (navigationHistory.length > 0) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setCurrentScreen(previousScreen);
    }
  };

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang as any);
    setCurrentScreen("home"); 
  };

  const handleLogin = () => {
    if (pendingAction) {
      const { screen, data } = pendingAction as any;
      setPendingAction(null);
      handleNavigation(screen, data);
    } else {
      setCurrentScreen("home");
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentScreen("login");
  };

  const handleSplashComplete = () => {
    if (!isInitialized) return;

    const hasLang = localStorage.getItem("language");
    if (hasLang) {
      const isAdmin = ["superadmin", "admin", "moderator"].includes(role || "");
      if (isAuthenticated && isAdmin) {
        setCurrentScreen("adminDashboard");
      } else {
        setCurrentScreen("home");
      }
    } else {
      setCurrentScreen("language");
    }
  };

  const handleLanguageChange = () => {
    setCurrentScreen("language");
  };

  const handleAdminLogin = () => {
    setCurrentScreen("adminDashboard");
  };

  const handleBackToUserLogin = () => {
    setCurrentScreen("login");
  };

  const showBottomNav = role === "user" && ["home", "search", "map", "chat", "profile", "favorites", "myListings"].includes(currentScreen);

  const renderScreen = () => {
    const fadeProps = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
    const slideXProps = { initial: { opacity: 0, x: 100 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -100 }, transition: { type: "spring", stiffness: 300, damping: 30 } };
    const popSlideProps = { initial: { opacity: 0, x: 100 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 100 }, transition: { type: "spring", stiffness: 300, damping: 30 } };
    const slideYProps = { initial: { opacity: 0, y: 100 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 100 }, transition: { type: "spring", stiffness: 300, damping: 30 } };
    const scaleProps = { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, transition: { type: "spring", stiffness: 300, damping: 30 } };

    const ScreenWrapper = ({ children, animation, keyName }: { children: React.ReactNode, animation: any, keyName: string }) => (
      <motion.div key={keyName} {...animation} className="absolute inset-0">
        {children}
      </motion.div>
    );

    switch (currentScreen) {
      case "splash":
        return <ScreenWrapper keyName="splash" animation={{ initial: { opacity: 1 }, exit: { opacity: 0 } }}><SplashScreen onComplete={handleSplashComplete} /></ScreenWrapper>;
      case "language":
        return <ScreenWrapper keyName="language" animation={slideXProps}><LanguageScreen onSelectLanguage={handleLanguageSelect} /></ScreenWrapper>;
      case "login":
        return (
          <ScreenWrapper keyName="login" animation={slideXProps}>
            <LoginScreen onLogin={handleLogin} onSkip={() => { setPendingAction(null); handleBack(); }} />
          </ScreenWrapper>
        );
      case "adminLogin":
        return <ScreenWrapper keyName="adminLogin" animation={scaleProps}><AdminLoginScreen onAdminLogin={handleAdminLogin} onBackToUser={handleBackToUserLogin} /></ScreenWrapper>;
      case "adminDashboard":
        const isAdmin = ["superadmin", "admin", "moderator"].includes(role || "");
        return isAdmin ? <ScreenWrapper keyName="adminDashboard" animation={fadeProps}><AdminDashboardScreen onLogout={handleLogout} /></ScreenWrapper> : null;
      case "home":           return <ScreenWrapper keyName="home" animation={fadeProps}><HomeScreen onNavigate={(s, d) => handleNavigation(s as AppScreen, d as Property)} /></ScreenWrapper>;
      case "search":         return <ScreenWrapper keyName="search" animation={fadeProps}><SearchScreen onNavigate={(s, d) => handleNavigation(s as AppScreen, d as Property)} /></ScreenWrapper>;
      case "detail":         return selectedProperty ? <ScreenWrapper keyName="detail" animation={popSlideProps}><PropertyDetailScreen property={selectedProperty} onNavigate={(s, d) => handleNavigation(s as AppScreen, d as Property)} onBack={handleBack} /></ScreenWrapper> : null;
      case "map":            return <ScreenWrapper keyName="map" animation={fadeProps}><MapScreen onNavigate={(s, d) => handleNavigation(s as AppScreen, d as Property)} /></ScreenWrapper>;
      case "chat":           return <ScreenWrapper keyName="chat" animation={fadeProps}><ChatScreen onBack={handleBack} /></ScreenWrapper>;
      case "profile":        return <ScreenWrapper keyName="profile" animation={fadeProps}><ProfileScreen onNavigate={(s, d) => handleNavigation(s as AppScreen, d as Property)} onLanguageChange={handleLanguageChange} onLogout={handleLogout} /></ScreenWrapper>;
      case "add":            return <ScreenWrapper keyName="add" animation={slideYProps}><AddListingScreen onBack={handleBack} onSubmit={handleBack} /></ScreenWrapper>;
      case "edit":           return selectedProperty ? <ScreenWrapper keyName="edit" animation={slideYProps}><AddListingScreen editProperty={selectedProperty} onBack={handleBack} onSubmit={handleBack} /></ScreenWrapper> : null;
      case "myListings":     return <ScreenWrapper keyName="myListings" animation={slideXProps}><MyListingsScreen onBack={handleBack} onEdit={(p) => handleNavigation("edit", p)} /></ScreenWrapper>;
      case "favorites":      return <ScreenWrapper keyName="favorites" animation={fadeProps}><FavoritesScreen onNavigate={(s, d) => handleNavigation(s as AppScreen, d as Property)} onBack={handleBack} /></ScreenWrapper>;
      default:               return (
        <div className="flex h-full flex-col items-center justify-center bg-background p-6 text-center">
          <div className="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-xl font-black text-foreground mb-2">Sahifa topilmadi</h2>
          <p className="text-sm text-slate-500 mb-8">Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki xatolik yuz berdi.</p>
          <button 
            onClick={() => setCurrentScreen("home")}
            className="w-full py-4 rounded-2xl bg-cyan-500 text-slate-950 font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center bg-background">
      <div className="relative h-full w-full max-w-md overflow-hidden bg-background shadow-2xl">
        <AnimatePresence mode="wait">
          {renderScreen()}
        </AnimatePresence>

        {showBottomNav && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <BottomNav active={currentScreen} onNavigate={(screen) => handleNavigation(screen as AppScreen)} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <PropertyProvider>
            <ChatProvider>
              <AppContent />
            </ChatProvider>
          </PropertyProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
