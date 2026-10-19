# NovaCart — High-Security eCommerce Platform

A full-stack, enterprise-grade eCommerce solution featuring:
- **Supabase PostgreSQL Database**: Complete relational schema with Row Level Security (RLS), performance indexes, and automatic timestamp triggers.
- **High-Security PHP 8.4 API Gateway**: Backend proxy that securely mediates database operations, protecting the `SUPABASE_SERVICE_ROLE_KEY` from client exposure, with rate-limiting, JWT authentication, and Bcrypt password hashing.
- **Interactive Manual (`help.html`)**: Step-by-step interactive documentation to deploy the frontend to servers (Vercel, Netlify, Cloudflare, VPS Nginx, cPanel), upload product photos & profile pictures (Supabase Storage, Cloudinary, S3/R2, PHP), create Supabase tables, retrieve API credentials, configure the backend, and verify connectivity.
- **Modern React 18 Frontend**: Single Page Application built with Vite, Tailwind CSS, and Lucide React, featuring real-time search, category filtering, cart drawer, discount coupon engine, checkout flow, customer reviews, order history, and an administrative dashboard.

---

## 🚀 Quick Start Guide

### 1. Configure Database & Deployment Guide
1. Open the interactive manual in your browser:  
   **[help.html](file:///home/farouk/development/help.html)** (or access it at `http://localhost:5173/help.html` or `http://localhost:8000/help.html`).
2. Follow the guide to create a Supabase project and execute **[schema.sql](file:///home/farouk/development/schema.sql)** in the Supabase SQL Editor.
3. Retrieve your **Project URL** and **service_role secret key** from Supabase Settings -> API.

### 2. Configure PHP Backend
```bash
cd backend
cp .env.example .env
# Edit .env and paste your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
```

Start the PHP API server:
```bash
php -S 127.0.0.1:8000 -t public
```
> Test backend health at: [http://localhost:8000/api/health](http://localhost:8000/api/health)

### 3. Launch React Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
> Open store in your browser: [http://localhost:5173](http://localhost:5173)

---

## 📂 Project Structure

```
development/
├── backend/                  # High-Security PHP 8.4 REST API
│   ├── public/
│   │   ├── index.php         # Front controller & router
│   │   ├── help.html         # Interactive manual copy
│   │   └── schema.sql        # SQL schema copy
│   ├── src/
│   │   ├── Config/           # Env loader & Security helper
│   │   ├── Controllers/      # Auth, Products, Orders, Admin, Reviews
│   │   ├── Middleware/       # JWT Auth & IP Rate Limiting
│   │   └── Services/         # Supabase PostgREST client
│   └── .env.example          # Environment template
├── frontend/                 # Modern React Frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/       # Navbar, Hero, ProductCard, Modals, Drawer
│   │   ├── context/          # AuthContext & CartContext
│   │   ├── services/         # api.js client (with fallback demo mode)
│   │   └── constants/        # mockData.js (matching schema seeds)
│   ├── public/
│   │   ├── help.html
│   │   └── schema.sql
│   └── package.json
├── help.html                 # Interactive Supabase Setup Manual
├── schema.sql                # Production PostgreSQL database schema
└── README.md                 # Project documentation
```
