import { useState, useEffect } from "react";
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
import { TopListingsScreen } from "./screens/TopListingsScreen";

// Components
import { BottomNav } from "./components/BottomNav";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { AdminDashboardScreen } from "./screens/AdminDashboardScreen";

type AppScreen = "splash" | "language" | "login" | "adminLogin" | "adminDashboard" | "home" | "search" | "detail" | "map" | "chat" | "profile" | "add" | "top";

type Property = {
  id: number;
  image: string;
  price: string;
  location: string;
  rooms: number;
  size: number;
  isTop?: boolean;
};

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("splash");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<AppScreen[]>([]);

  const { isAuthenticated, role, isInitialized, login, logout } = useAuth();

  useEffect(() => {
    const hasSelectedLanguage = localStorage.getItem("language");
    if (hasSelectedLanguage) {
      setSelectedLanguage(hasSelectedLanguage);
    }
  }, []);

  const handleNavigation = (screen: AppScreen, data?: Property) => {
    // Prevent normal users from navigating to adminDashboard manually
    if (screen === "adminDashboard" && role !== "admin") return;

    // Use functional updater to avoid stale closure on navigationHistory
    setNavigationHistory(prev => [...prev, currentScreen]);

    if (data !== undefined) {
      setSelectedProperty(data);
    } else if (screen !== "detail") {
      // Clear stale property when navigating away from detail
      setSelectedProperty(null);
    }

    setCurrentScreen(screen);
  };

  const handleBack = () => {
    if (navigationHistory.length > 0) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      // Use functional updater to avoid stale closure on navigationHistory
      setNavigationHistory(prev => prev.slice(0, -1));
      setCurrentScreen(previousScreen);
    }
  };

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    localStorage.setItem("language", lang);
    setCurrentScreen("login");
  };

  const handleLogin = () => {
    login("user");
    setCurrentScreen("home");
  };

  const handleLogout = () => {
    logout();
    setCurrentScreen("login");
  };

  const handleSplashComplete = () => {
    // Wait for auth hydration from localStorage before routing
    if (!isInitialized) return;

    if (selectedLanguage && isAuthenticated) {
      setCurrentScreen(role === "admin" ? "adminDashboard" : "home");
    } else if (selectedLanguage) {
      setCurrentScreen("login");
    } else {
      setCurrentScreen("language");
    }
  };

  const handleLanguageChange = () => {
    setCurrentScreen("language");
  };

  const handleAdminAccess = () => {
    setCurrentScreen("adminLogin");
  };

  const handleAdminLogin = () => {
    login("admin");
    setCurrentScreen("adminDashboard");
  };

  const handleBackToUserLogin = () => {
    setCurrentScreen("login");
  };

  // Only show bottom nav for users, not admins
  const showBottomNav = role === "user" && ["home", "search", "map", "chat", "profile", "top"].includes(currentScreen);

  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center bg-[#121212]">
      <div className="relative h-full w-full max-w-md overflow-hidden bg-[#121212] shadow-2xl">
        <AnimatePresence mode="wait">
          {currentScreen === "splash" && (
            <motion.div
              key="splash"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <SplashScreen onComplete={handleSplashComplete} />
            </motion.div>
          )}

          {currentScreen === "language" && (
            <motion.div
              key="language"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0"
            >
              <LanguageScreen onSelectLanguage={handleLanguageSelect} />
            </motion.div>
          )}

          {currentScreen === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0"
            >
              <LoginScreen onLogin={handleLogin} onAdminAccess={handleAdminAccess} />
            </motion.div>
          )}

          {currentScreen === "adminLogin" && (
            <motion.div
              key="adminLogin"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0"
            >
              <AdminLoginScreen
                onAdminLogin={handleAdminLogin}
                onBackToUser={handleBackToUserLogin}
              />
            </motion.div>
          )}
          
          {currentScreen === "adminDashboard" && role === "admin" && (
            <motion.div
              key="adminDashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <AdminDashboardScreen onLogout={handleLogout} />
            </motion.div>
          )}

          {currentScreen === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <HomeScreen onNavigate={handleNavigation} />
            </motion.div>
          )}

          {currentScreen === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <SearchScreen onNavigate={handleNavigation} />
            </motion.div>
          )}

          {currentScreen === "detail" && selectedProperty && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0"
            >
              <PropertyDetailScreen
                property={selectedProperty}
                onNavigate={handleNavigation}
                onBack={handleBack}
              />
            </motion.div>
          )}

          {currentScreen === "map" && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <MapScreen onNavigate={handleNavigation} />
            </motion.div>
          )}

          {currentScreen === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <ChatScreen onBack={handleBack} />
            </motion.div>
          )}

          {currentScreen === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <ProfileScreen
                onNavigate={handleNavigation}
                onLanguageChange={handleLanguageChange}
                onLogout={handleLogout}
              />
            </motion.div>
          )}

          {currentScreen === "add" && (
            <motion.div
              key="add"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0"
            >
              <AddListingScreen
                onBack={handleBack}
                onSubmit={handleBack}
              />
            </motion.div>
          )}

          {currentScreen === "top" && (
            <motion.div
              key="top"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <TopListingsScreen onNavigate={handleNavigation} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring