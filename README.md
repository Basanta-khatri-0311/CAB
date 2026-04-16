# Cricket Association of Bhaluhi (CAB) Portal

A premium, full-stack web application designed for the Cricket Association of Bhaluhi. This portal serves as a central hub for managing club activities, member directories, financial transparency, and facility bookings.

![CAB Design](https://img.shields.io/badge/Design-Midnight--Amber-amber)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-8-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38b2ac)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)

---

## 🌟 Key Features

### 🏏 Public Features
- **Project Gallery**: Browse through association projects and tournament highlights.
- **Member Directory**: View all registered members and their profiles.
- **News & Posts**: Stay updated with the latest announcements and cricket news from Bhaluhi.
- **Ground Booking**: Integrated system for booking ground facilities.
- **Transparency Portal**: Public/Authorized view of association finances and activities.

### 🔐 Member & Admin Features
- **User Authentication**: Secure Login/Register system using JWT.
- **Admin Dashboard**: Comprehensive management interface for:
  - **Projects**: Create and update association projects.
  - **Finances**: Log and track income/expenses.
  - **Posts**: Manage news and blogs.
  - **Bookings**: Oversee and approve facility requests.
  - **Members**: Manage the association's member database.
- **Profile Management**: Members can update their personal information.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [React 19](https://reactjs.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing**: React Router 7
- **Icons**: React Icons
- **Flash Messages**: Integrated Toast system

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose 9
- **Authentication**: JWT & Bcryptjs
- **File Uploads**: Multer

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB account (Atlas or Local)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CAB
   ```

2. **Setup Server**
   ```bash
   cd server
   npm install
   # Create a .env file based on .env.example (if available)
   # Required: MONGO_URI, JWT_SECRET, PORT
   npm run dev
   ```

3. **Setup Client**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

---

## 📂 Project Structure

```text
CAB/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views & Admin panels
│   │   └── App.jsx      # Main routing logic
├── server/              # Node.js backend
│   ├── src/
│   │   ├── config/      # DB connection
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API endpoints
│   │   └── server.js    # Entry point
└── uploads/             # Managed file storage
```

---

## 🎨 Design System
The application follows a bespoke **"Midnight-Amber"** aesthetic:
- **Primary Background**: Sleek dark modes.
- **Accent**: Vibrant Amber transitions.
- **Typography**: Clean, modern font stacks.

---

## 📄 License
This project is licensed under the ISC License.