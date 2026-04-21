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

const app = express()

// --- SYSTEM DESIGN & SECURITY MIDDLEWARE ---

// Data Sanitization against NoSQL Injection
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// General Rate Limiter (Prevent DDoS/Scraping)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: "Too many requests from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter Rate Limiter for Auth (Anti Brute-Force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15, // 15 attempts per 15 minutes
  message: { message: "Too many login/registration attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security & Optimization
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow local images if needed
}));
app.use(compression());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim().replace(/\/$/, ""))
  : ["http://localhost:5173"];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Clean the incoming origin to ensure consistent matching
    const cleanOrigin = origin.replace(/\/$/, "");

    if (allowedOrigins.indexOf(cleanOrigin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}))

// Apply general rate limit to all request except auth
app.use("/api", generalLimiter);

// Specific stricter limit for Auth
app.use("/api/auth", authLimiter, authRoutes);

app.use(express.json()) //for allowing the json type
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