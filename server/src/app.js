const express = require('express')
const cors = require('cors')
const projectRoutes = require("./routes/project.routes");
const financeRoutes = require("./routes/finance.routes");
const authRoutes = require('./routes/auth.routes');
const publicRoutes = require('./routes/public.routes');
const postRoutes = require('./routes/post.routes');
const userRoutes = require('./routes/user.routes');
const uploadRoutes = require('./routes/upload.routes');
const path = require('path');
const fs = require('fs');

const helmet = require('helmet');
const compression = require('compression');

const app = express()

// Security & Optimization
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow local images if needed
}));
app.use(compression());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ["http://localhost:5173"];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}))
app.use(express.json()) //for allowing the json type
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/projects', projectRoutes)
app.use('/api/finances', financeRoutes)
app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("COB Backend Running");
});

module.exports = app