# 🏏 Cricket Association of Bhaluhi (CAB) Portal

[![Performance](https://img.shields.io/badge/Lighthouse-90+-emerald)](https://ca-bhaluhi.netlify.app/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

The **Cricket Association of Bhaluhi (CAB) Portal** is a high-performance, full-stack management system built on the MERN stack. Designed with a premium "Midnight-Amber" aesthetic, it serves as the association's digital headquarters for financial transparency, member coordination, and community engagement.

## 🌟 Core Features

### 🏛 The Treasury (Transparency Portal)
- Real-time tracking of association income and expenses.
- Detailed project-level financial breakdowns with interactive SVG visualizations.
- Secure, member-only access to detailed transaction ledgers.

### 👥 The Squad & Board
- Dynamic member directory with professional profile cards.
- Multi-role support (President, Captain, Advisor, etc.).
- Integrated bio and athlete tracking system.

### 📰 Newsroom & Milestones
- Rich-text newsfeed for official association announcements.
- Project tracking system documenting association initiatives from 'Ongoing' to 'Completed'.

### 🔐 Security & Administration
- **Secure Auth**: Migration to **HttpOnly Cookies** and JWT for robust session management.
- **Admin Dashboard**: Full CRUD capabilities for projects, members, finances, and news.
- **Global Error Handling**: Centralized system ensuring the app remains stable during server downtimes.

---

## 🛠 Technical Architecture

### Frontend
- **React 19 / Vite 8**: Bleeding-edge build tools for near-instant HMR.
- **Tailwind CSS 4**: Modern, utility-first styling with custom "Midnight" design tokens.
- **Lazy Loading**: Route-based code splitting to reduce the initial JS payload.

### Backend
- **Express 5**: High-performance Node.js framework.
- **MongoDB / Mongoose**: Optimized schemas with relationship population for complex data structures.
- **Security Middleware**: CORS, Helmet, and cookie-parser for production hardening.

---

## 📂 Installation & Setup

### Prerequisites
- Node.js v20+
- MongoDB Instance (Local or Atlas)
- Cloudinary Account (for image hosting)

### 1. Clone & Install
```bash
git clone <repository-url>
cd CAB
npm install # Installs root dependencies
```

### 2. Environment Configuration
Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
NODE_ENV=production
CLIENT_URL=http://localhost:5173
```

### 3. Launch Development Environment
```bash
# Terminal 1 (Backend)
cd server && npm run dev

# Terminal 2 (Frontend)
cd client && npm run dev
```

---

## 📄 License
This project is licensed under the **ISC License**. Designed and developed for the community of Bhaluhi.