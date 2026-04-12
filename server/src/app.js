const express = require('express')
const cors = require('cors')
const projectRoutes = require("./routes/project.routes");
const financeRoutes = require("./routes/finance.routes");
const authRoutes = require('./routes/auth.routes');
const publicRoutes = require('./routes/public.routes');
const postRoutes = require('./routes/post.routes');
const bookingRoutes = require('./routes/booking.routes');

const app = express()

//middlewares
app.use(cors()) //for cross origin access
app.use(express.json()) //for allowing the json type
app.use('/api/projects', projectRoutes)
app.use('/api/finances', financeRoutes)
app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/bookings", bookingRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("COB Backend Running");
});

module.exports = app