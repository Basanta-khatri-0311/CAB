const express = require('express')
const cors = require('cors')
const projectRoutes = require("./routes/project.routes");
const financeRoutes = require("./routes/finance.routes");
const authRoutes = require('./routes/auth.routes');
const publicRoutes = require('./routes/public.routes');
const postRoutes = require('./routes/post.routes');
const bookingRoutes = require('./routes/booking.routes');
const userRoutes = require('./routes/user.routes');
const uploadRoutes = require('./routes/upload.routes');
const path = require('path');
const fs = require('fs');

const app = express()

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

//middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
})) //for cross origin access
app.use(express.json()) //for allowing the json type
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/projects', projectRoutes)
app.use('/api/finances', financeRoutes)
app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("COB Backend Running");
});

module.exports = app