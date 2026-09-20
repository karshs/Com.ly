# Com.ly — Branded Short-Link & Bio-Link Hub

A full-stack high-performance URL shortening engine and creator Link-in-Bio hub inspired by Bitly and Linktree.

---

## 🔒 Security & Architecture
- **Pair Token JWT Authentication**:
  - Short-lived Access Token (`15m`) stored in memory / client headers.
  - Long-lived Refresh Token (`7d`) stored in secure, `httpOnly`, `SameSite=Strict` cookies with automatic rotation.
- **Authentication Workflows**:
  - Signup with email verification token simulation.
  - Login with credential validation and token rotation.
  - Forgot Password and Password Reset with time-bound one-time reset tokens.
- **Rate Limiting**:
  - Strict IP-based rate limiting via `express-rate-limit` on Auth (`/api/auth`), Link Creation (`/api/links`), and Redirection (`/r/:shortCode`).
- **Telemetry Privacy**:
  - Client IP addresses are hashed using SHA-256 with a secret salt (`hashIp.js`) before persistence to protect visitor privacy.

---

## 🚀 Key Features

### 1. High-Speed URL Redirection Engine
- Generates unique 6-character Base62 alphanumeric short codes or accepts custom vanity slugs (e.g., `/r/summer-sale`).
- Collision detection against existing aliases and reserved system keywords (`api`, `auth`, `r`, `bio`, etc.).
- High-speed `302 Found` redirection at `GET /r/:shortCode` with asynchronous non-blocking click telemetry logging.

### 2. Click Analytics & Metrics Dashboard
- Asynchronously logs click metadata:
  - Timestamp
  - HTTP Referrer (domain extraction / direct)
  - Device Type (`Desktop`, `Mobile`, `Tablet`) via user-agent detection
  - Anonymized IP hash
- Interactive analytics dashboard built with **Recharts**:
  - Total clicks over time (30-day time series)
  - Top referrers bar chart & ranking
  - Device distribution donut/pie metrics

### 3. Link Library Studio
- Management table showing destination URL, short link, one-click clipboard copy, QR code modal preview & download, and deletion.
- Real-time search by short slug or target URL with server-side pagination.

### 4. Link-in-Bio Customizer & Public Route
- Visual builder for creators to configure avatar URL, display name, bio description, and social link buttons (add, delete, reorder).
- Theme Selector: **Minimal Light**, **Dark Slate**, and **Gradient**.
- Live interactive mobile phone mockup preview.
- Public mobile-responsive profile route at `/bio/:username`.

---

## 📁 Repository Structure

```
Com.ly/
├── client/                     # React 19 + Vite Frontend
│   ├── src/
│   │   ├── api/                # Axios API modules (auth, link, analytics, bio)
│   │   ├── components/         # Coss UI components (AppLayout, Modal, QRModal, ProtectedRoute)
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── hooks/              # useAuth, useToast
│   │   ├── pages/              # Landing, Auth, Dashboard, Links, Analytics, BioBuilder, PublicBio
│   │   ├── utils/              # Error parsers
│   │   └── index.css           # coss.com/ui design token styling system
│   └── .env.example
├── server/                     # Node.js + Express + MongoDB Backend
│   ├── src/
│   │   ├── config/             # MongoDB connection
│   │   ├── controllers/        # Auth, Link, Analytics, Bio controllers
│   │   ├── middleware/         # Auth protection, Rate limiters
│   │   ├── models/             # User, Link, Click, BioProfile Mongoose schemas
│   │   ├── routes/             # Express API routes
│   │   ├── utils/              # Token generator, short code generator, device detector, IP hasher
│   │   └── app.js              # Express app configuration
│   ├── server.js               # Server entry point (Port 5000)
│   └── .env.example
└── docs/                       # Project specifications and API documentation
```

---

## 🛠️ Getting Started

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

---

## 📖 API Documentation
For detailed request/response schemas for all endpoints, see [`docs/04_api_reference.md`](docs/04_api_reference.md).