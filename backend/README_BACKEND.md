# UY JOY Backend API

This is the central API layer for the UY JOY platform, built with Node.js, TypeScript, and Express. It integrates with Supabase for Authentication and Database management.

## 🚀 Features
- **Supabase Auth**: Secure user registration and login.
- **Posts System**: CRUD operations for property posts.
- **TypeScript**: Type-safe development.
- **CORS**: Pre-configured for React and Flutter integration.

## 🛠️ Installation

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `backend` directory (based on `.env.example`).
   ```env
   PORT=3001
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Run in development mode**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
  - Body: `{ "email": "...", "password": "...", "name": "..." }`
- `POST /api/auth/login` - Login user
  - Body: `{ "email": "...", "password": "..." }`
- `GET /api/auth/me` - Get current user profile (requires Auth header)

### Posts
- `GET /api/posts` - Get all posts (latest first)
- `POST /api/posts` - Create a post (requires Auth header)
  - Body: `{ "title": "...", "description": "..." }`
- `DELETE /api/posts/:id` - Delete a post by owner (requires Auth header)

### Health Check
- `GET /health` - Check API status

## 📱 Integration Guide

### Authorization Header
For all protected routes, include the Supabase session token:
`Authorization: Bearer <your_jwt_token>`

### Database Schema (Supabase)
Ensure you have a `posts` table in your Supabase project with the following columns:
- `id`: uuid (primary key)
- `title`: text
- `description`: text
- `user_id`: uuid (foreign key to auth.users)
- `created_at`: timestamptz
