# UY JOY SOTISH VA SOTIB OLISH - Real Estate App

## Premium Mobile Real Estate Marketplace

A luxury dark-themed real estate mobile application built with React, TypeScript, and Motion animations.

---

## 🔐 DUAL AUTHENTICATION SYSTEM

### 1. USER LOGIN (Standard Access)
- **Phone Number Login**: SMS OTP verification
- **Passport ID Alternative**: Optional verification method
- **Clean UI**: Minimal, user-friendly interface
- **Direct Access**: Quick login to browse and manage listings

**Access Path**: Standard login screen

### 2. ADMIN LOGIN (Restricted Access)
- **Hidden Entry**: Tap the logo 5 times on user login screen
- **Secure Login**: Email/Phone + Password authentication
- **Security Design**: Red warning theme, "Authorized Personnel Only"
- **Separate Dashboard**: Redirects to admin panel (concept)

**Access Path**: User Login → Tap Logo 5x → Admin Login Screen

---

## 📱 MAIN APP FEATURES

### Bottom Navigation (6 Screens)
1. **Home** - Property feed with TOP listings carousel
2. **Search** - Advanced filters (price, size, type, category)
3. **Add** - Create new listing (verified users only)
4. **Top** - Premium featured listings with gold badges
5. **Chat** - Messaging with verified sellers
6. **Profile** - User stats, listings, settings

### Core Functionality

#### Property Discovery
- **Home Feed**: Curated TOP listings + new properties
- **Advanced Search**: Category (sale/rent), property type, price range, size filters
- **Map View**: Interactive map with price pins and clustering
- **Top Listings**: Premium boosted properties with priority placement

#### Property Details
- **Image Gallery**: Swipeable image carousel
- **Verified Sellers**: Trust badges and verification status
- **Property Stats**: Bedrooms, size (m²), location
- **Similar Listings**: Recommendation engine
- **Contact Options**: Call, Message, Save

#### Listing Creation (Verified Users Only)
- **Image Upload**: Minimum 3 images required
- **Map Location**: Mandatory location selection
- **Property Details**: Price, rooms, size, description
- **Contact Info**: Phone number
- **Validation**: Error messages for missing requirements

#### Messaging System
- **Chat List**: Recent conversations with unread indicators
- **Verified Badges**: Visual trust signals
- **Real-time Status**: Online/offline indicators
- **Media Sharing**: Image support
- **Clean Interface**: Modern message bubbles

#### User Profile
- **Stats Dashboard**: Listings, saved properties, views
- **My Listings**: Property management
- **Saved Properties**: Favorites collection
- **Settings**: Language switcher, preferences
- **Verification Status**: Trust badge display

---

## 🎨 DESIGN SYSTEM

### Color Palette
- **Primary**: `#0B1D3A` (Deep Navy)
- **Background**: `#121212` (Dark Gray)
- **Accent**: `#00D4FF` (Neon Blue)
- **Premium**: `#FFD700` (Gold)
- **Surface**: `rgba(255, 255, 255, 0.05)` (Glass)

### Typography
- **Font**: Inter (400, 500, 600, 700)
- **Spacing**: 8px system
- **Radius**: 16px (1rem) rounded corners

### Components
- **GlassCard**: Glassmorphism with backdrop blur
- **PropertyCard**: Image + details with hover lift
- **Badge**: TOP, Verified, Premium variants
- **BottomNav**: Fixed navigation with active states
- **Buttons**: Primary (cyan), Secondary (glass), Danger (red)

### Animations
- **Page Transitions**: Smooth spring animations
- **Micro-interactions**: Hover effects, tap feedback
- **Loading States**: Skeleton screens
- **Entrance Animations**: Staggered reveals

---

## 🌍 MULTI-LANGUAGE SUPPORT

### Supported Languages
- English 🇬🇧
- Russian 🇷🇺
- Uzbek 🇺🇿

### Flow
1. **First Launch**: Language selection screen (mandatory)
2. **Subsequent Launches**: Skip to login (stored preference)
3. **Settings**: Change language in profile settings
4. **Text Expansion**: UI supports longer Russian text

---

## 🔒 SECURITY & VERIFICATION

### User Verification
- **Phone OTP**: SMS verification required
- **Passport ID**: Optional enhanced verification
- **Verified Badge**: Visual trust indicator
- **Listing Requirements**: Only verified users can post

### Admin Security
- **Hidden Access**: 5-tap gesture on login logo
- **Separate Authentication**: Email/password system
- **Audit Trail**: "All access attempts are logged"
- **Restricted UI**: Red warning theme

---

## 💎 MONETIZATION FEATURES (UI)

### TOP Listings
- **Gold Badge**: Premium visual indicator
- **Priority Placement**: Featured on home, search, map
- **Ring Highlight**: Gold ring around cards
- **Dedicated Section**: Top Listings screen
- **Boost Status**: Visible premium indicator

### Features
- Priority in search results
- Featured homepage carousel
- Gold badge highlighting
- Map pin prominence
- Separate TOP screen access

---

## 🗺️ MAP SYSTEM

### Features
- **Interactive Map**: Full-screen property browsing
- **Price Pins**: Clustered property markers
- **Pulsing Animation**: Attention-grabbing effects
- **Filter Button**: Floating glass controls
- **Location Picker**: Add listing location selection

### Logic (Yandex Maps Style)
- Store latitude/longitude coordinates
- Radius-based search support
- Pin clustering for performance
- Direct property navigation

---

## ✅ UX REQUIREMENTS MET

- ✅ Verified users only can post listings
- ✅ Minimum 3 images required
- ✅ Map-based location selection
- ✅ Clean, fast, production-ready UI
- ✅ Mobile-first design (iPhone 14 optimized)
- ✅ Component-based architecture
- ✅ Dark mode glassmorphism
- ✅ Dual authentication system
- ✅ Multi-language support
- ✅ Bottom navigation with 6 screens

---

## 🚀 TECHNICAL STACK

- **Framework**: React 18.3.1
- **Language**: TypeScript
- **Animations**: Motion (Framer Motion)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Images**: Unsplash API integration
- **State**: React Hooks (useState, useEffect)
- **Storage**: LocalStorage (language, auth)

---

## 📂 PROJECT STRUCTURE

```
src/
├── app/
│   ├── components/
│   │   ├── Badge.tsx
│   │   ├── BottomNav.tsx
│   │   ├── GlassCard.tsx
│   │   └── PropertyCard.tsx
│   ├── screens/
│   │   ├── SplashScreen.tsx
│   │   ├── LanguageScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── AdminLoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── PropertyDetailScreen.tsx
│   │   ├── MapScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── AddListingScreen.tsx
│   │   └── TopListingsScreen.tsx
│   └── App.tsx
├── styles/
│   ├── fonts.css
│   ├── theme.css
│   └── tailwind.css
```

---

## 🎯 KEY USER FLOWS

### New User Flow
1. Splash Screen (2.5s)
2. Language Selection (first time only)
3. User Login (OTP)
4. Home Screen

### Property Browsing
1. Home → Property Card → Detail Screen
2. Search → Filters → Results → Detail
3. Map → Price Pin → Detail

### Creating Listing
1. Profile → Add New
2. Upload 3+ Images
3. Select Location (Map)
4. Enter Details
5. Submit (with validation)

### Admin Access
1. Login Screen → Tap Logo 5x
2. Admin Login Form
3. Email + Password
4. Redirect to Admin Dashboard

---

## 🎨 GLASSMORPHISM DESIGN

### Glass Card Properties
- Background: `rgba(255, 255, 255, 0.05)`
- Border: `rgba(255, 255, 255, 0.12)`
- Backdrop Filter: `blur(12px)`
- Shadow: Soft elevation
- Hover: Scale + lift animation

### Surface Hierarchy
1. **Background**: `#121212`
2. **Surface**: Glass cards (5% white)
3. **Elevated**: Glass cards (8% white)
4. **Interactive**: Hover state (10% white)

---

## 📱 RESPONSIVE DESIGN

- **Mobile First**: iPhone 14 (390x844)
- **Max Width**: 448px container
- **Flexible Layout**: Auto-layout system
- **Touch Targets**: Min 44px tap areas
- **Scroll**: Natural momentum scrolling
- **Fixed Elements**: Bottom nav, headers

---

## 🔔 FUTURE ENHANCEMENTS

- Real backend API integration
- Push notifications for messages
- Payment system for TOP listings
- Advanced analytics dashboard
- Social sharing features
- Favorites synchronization
- Property comparison tool
- AR property viewing

---

## 📄 LICENSE

Private - UY JOY Real Estate Platform
© 2026 All Rights Reserved
