# Com.ly — Branded Short-Link & Bio-Link Hub

<p align="center">
  <img src="client/public/banner.png" alt="Comly Banner" width="100%" />
</p>

<p align="center">
  <strong>A high-performance URL shortening engine with custom vanity slugs, real-time click telemetry analytics, dynamic QR codes, and a Link-in-Bio creator hub.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6.0-purple?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.21-lightgrey?style=flat-square&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-emerald?style=flat-square&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-Pair_Token_Auth-yellow?style=flat-square&logo=jsonwebtokens" alt="JWT" />
</p>

---

## 📌 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Security & Architecture](#-security--architecture)
- [Technology Stack](#-technology-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Environment Variables](#-environment-variables)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Database Setup & Indexing](#-database-setup--indexing)
- [API Reference](#-api-reference)
- [Design Decisions & Assumptions](#-design-decisions--assumptions)

---

## 🌟 Overview
**Com.ly** is a creator-focused MERN stack platform inspired by Bitly and Linktree. It allows creators, businesses, and developers to shorten URLs with memorable custom aliases, generate downloadable dynamic QR codes, inspect visitor click analytics (devices, referrers, timeline), and build customizable "Link-in-Bio" profile pages.

---

## 🚀 Key Features

### 1. High-Speed URL Redirection Engine
- **Automatic & Vanity Slug Generation**: Generates 6-character Base62 alphanumeric codes or accepts custom vanity slugs (e.g., `/r/summer-sale`).
- **Collision & Keyword Protection**: Validates against URL patterns, duplicates, and system-reserved slugs (`api`, `auth`, `r`, `bio`, `dashboard`, `admin`).
- **Low-Latency Redirection**: Issues instant `302 Found` redirects on `GET /r/:shortCode` with asynchronous, non-blocking telemetry click recording.

### 2. Deep Click Telemetry & Analytics Dashboard
- **Telemetry Ingestion**: Captures timestamp, HTTP referrer domain, device type (`Desktop`, `Mobile`, `Tablet`), and privacy-safe anonymized IP hashes.
- **Visual Performance Dashboard**: Built using **Recharts**:
  - 30-day click activity time series (Area chart with smooth gradient).
  - Device distribution metrics (Donut/Pie chart).
  - Top traffic referrers breakdown (Horizontal bar chart).

### 3. Link Library Studio
- Management table showing target destination, shortened link, instant clipboard copy, dynamic QR modal preview, and delete capability.
- Instant search by vanity slug or target URL with server-side pagination.
- **Dynamic QR Codes**: Instant SVG vector downloads with high error tolerance.

### 4. Link-in-Bio Customizer & Public Route
- Visual builder allowing creators to manage their avatar, display name, bio description, and social link buttons (add, delete, reorder).
- **Multiple Curated Themes**: Minimal Light, Dark Slate, and Gradient.
- **Interactive Live Phone Mockup**: Real-time side-by-side preview.
- **Public Mobile-Responsive Route**: Accessible at `/bio/:username`.

---

## 🔒 Security & Architecture

### Pair-Token JWT Authentication Flow
- **Access Token**: Short-lived (`15 minutes`) JWT kept in client memory / `Authorization: Bearer` headers.
- **Refresh Token**: Long-lived (`7 days`) JWT persisted securely in `httpOnly`, `SameSite=Strict`, `secure` (in production) cookies.
- **Token Rotation**: Every refresh request verifies the token family and automatically rotates the refresh token to prevent replay attacks.
- **Full Auth Lifecycle**: Signup with email verification simulation, login, forgot password, and time-limited reset password tokens.

### Privacy-Preserving Telemetry & Protection
- **IP Anonymization**: Client IP addresses are hashed using SHA-256 with a salt key before storage, ensuring GDPR/privacy compliance.
- **Rate Limiting**: Built with `express-rate-limit` on:
  - Auth routes (`/api/auth/*`): 20 requests per 15 minutes.
  - Link creation (`/api/links`): 60 requests per 15 minutes.
  - Public redirection (`/r/:shortCode`): 300 requests per 15 minutes.

---

## 💻 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router v7, Lucide React, Recharts, React QR Code |
| **Styling** | Custom Vanilla CSS Design System (Warm Indie + Bitly Cobalt Blue palette) |
| **Backend** | Node.js, Express.js (REST API, Cookie-Parser, CORS, Helmet, Rate Limit) |
| **Database** | MongoDB with Mongoose ODM |
| **Security** | JWT (jsonwebtoken), bcryptjs, SHA-256 IP Hasher, express-rate-limit |

---

## 📁 Project Directory Structure

```
Com.ly/
├── client/                     # React 19 + Vite Frontend
│   ├── public/                 # Static assets (logo.png, favicon.svg, banner.png)
│   ├── src/
│   │   ├── api/                # Axios service modules (auth, link, analytics, bio)
│   │   ├── components/         # Layouts, Modals (CreateLinkModal, QRModal, ProtectedRoute)
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── hooks/              # useAuth, useToast
│   │   ├── pages/              # LandingPage, AuthPages, Dashboard, Links, Analytics, BioBuilder, PublicBio
│   │   ├── utils/              # Error handling & API response helpers
│   │   ├── App.jsx             # Route definitions & layout wrappers
│   │   └── index.css           # Global design system & token definitions
│   ├── index.html              # HTML entry point with custom C favicon
│   ├── package.json
│   └── .env.example
├── server/                     # Express + MongoDB API Server
│   ├── src/
│   │   ├── config/             # MongoDB connection configuration
│   │   ├── controllers/        # Auth, Link, Analytics, Bio controllers
│   │   ├── middleware/         # Auth verification, rate limiters, error handlers
│   │   ├── models/             # User, Link, Click, BioProfile schemas
│   │   ├── routes/             # REST endpoint routers
│   │   ├── utils/              # Token rotation, IP hasher, Device detector, Short code generator
│   │   └── app.js              # Express app middleware assembly
│   ├── server.js               # Application HTTP server entry point
│   ├── package.json
│   └── .env.example
└── docs/                       # Project architecture documentation & API references
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
Create a `.env` file in the `server/` directory:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
BASE_URL=http://localhost:5000

# MongoDB URI
MONGO_URI=mongodb://localhost:27017/comly

# JWT Secrets
JWT_ACCESS_SECRET=your_super_secret_access_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Telemetry Privacy
IP_HASH_SALT=your_random_ip_hash_salt_string
```

### Frontend (`client/.env`)
Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_BASE_URL=http://localhost:5000
```

---

## 🛠️ Getting Started & Local Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance running on port `27017` or a MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Com.ly
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env     # Update MONGO_URI and JWT secrets as needed
npm run dev              # Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../client
npm install
cp .env.example .env     # Verify VITE_API_URL points to backend
npm run dev              # Runs on http://localhost:5173
```

---

## 🗄️ Database Setup & Indexing

Com.ly utilizes MongoDB with optimized indexes for ultra-fast redirection and analytics aggregation:

- **`links` Collection**:
  - `shortCode`: Unique index (`{ shortCode: 1 }`) for instant $O(1)$ redirect lookups.
  - `userId`: Index for user library filtering (`{ userId: 1, createdAt: -1 }`).
- **`clicks` Collection**:
  - Compound Index: `{ linkId: 1, timestamp: -1 }` for high-speed time-series and referrer queries.
- **`users` Collection**:
  - `email` & `username`: Unique indexes for conflict-free authentication.
- **`bioprofiles` Collection**:
  - `userId`: Unique 1-to-1 relationship with the creator account.

---

## 📡 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user account | No |
| `POST` | `/api/auth/login` | Log in and receive access token + refresh cookie | No |
| `POST` | `/api/auth/refresh` | Rotate pair tokens using refresh cookie | Yes (Cookie) |
| `POST` | `/api/auth/logout` | Clear refresh cookie | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer) |
| `GET` | `/api/auth/verify/:token` | Verify email address | No |
| `POST` | `/api/auth/forgot-password`| Request password reset link | No |
| `POST` | `/api/auth/reset-password/:token` | Reset password using one-time token | No |

### Short Links & Redirection
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/links` | Create a short link with optional alias | Yes (Bearer) |
| `GET` | `/api/links` | Get user links (with search & pagination) | Yes (Bearer) |
| `DELETE`| `/api/links/:id` | Delete a short link | Yes (Bearer) |
| `GET` | `/r/:shortCode` | Public 302 redirection endpoint with telemetry | No |

### Analytics & Bio Profile
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/analytics/overview/:linkId` | Total clicks and active days summary | Yes (Bearer) |
| `GET` | `/api/analytics/timeseries/:linkId`| 30-day click trends data | Yes (Bearer) |
| `GET` | `/api/analytics/devices/:linkId` | Device breakdown (desktop, mobile, tablet)| Yes (Bearer) |
| `GET` | `/api/analytics/referrers/:linkId`| Top traffic referrers list | Yes (Bearer) |
| `GET` | `/api/bio/me` | Get creator's own Bio-Link profile | Yes (Bearer) |
| `PUT` | `/api/bio/me` | Update Bio-Link profile details & links | Yes (Bearer) |
| `GET` | `/api/bio/public/:username` | Public view of creator's bio page | No |

---

## 💡 Design Decisions & Assumptions

1. **Non-Blocking Telemetry**: Click recording is triggered asynchronously during the redirect request so visitors experience zero latency overhead during redirection.
2. **IP Privacy**: In adherence to privacy standards, IP addresses are salted and hashed with SHA-256 before persistence.
3. **Email Simulation**: In local development, email verification and password reset links return simulated test tokens in API responses and console logs for seamless end-to-end testing without external SMTP credentials.