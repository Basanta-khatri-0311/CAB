const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')
const projectRoutes = require("./routes/project.routes");
const financeRoutes = require("./routes/finance.routes");
const authRoutes = require('./routes/auth.routes');
const publicRoutes = require('./routes/public.routes');
const postRoutes = require('./routes/post.routes');
const userRoutes = require('./routes/user.routes');
const uploadRoutes = require('./routes/upload.routes');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const app = express()

// 1. Basic Middlewares (Parse data first)
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow no-origin requests (like mobile/Postman)
    if (!origin) return callback(null, true);

    // 2. Normalize origin
    const cleanOrigin = origin.replace(/\/$/, "");

    // 3. Get allowed domains from env or default
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim().replace(/\/$/, ""))
      : ["http://localhost:5173", "http://localhost:5500"];

    // 4. Validate
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      return callback(new Error('CORS Not Allowed'), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. Security Sanitizers (Must come AFTER body parsing)
// app.use(mongoSanitize());
app.use(hpp());

// 3. Security & Optimization Headers
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());

// 4. Rate Limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { message: "Too many login/registration attempts" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limit to all request except auth
app.use("/api", generalLimiter);

// Specific stricter limit for Auth
app.use("/api/auth", authLimiter, authRoutes);

app.use('/api/projects', projectRoutes)
app.use('/api/finances', financeRoutes)
app.use("/api/public", publicRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// Health Check Endpoint (System Design Practice)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Test Route
app.get("/", (req, res) => {
  res.send("CAB Backend Running");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

module.exports = app