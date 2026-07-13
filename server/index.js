const express = require("express");
const cors = require("cors");

const recsRouter = require("./routes/recs");
const likesRouter = require("./routes/likes");
const commentsRouter = require("./routes/comments");
const ogRouter = require("./routes/og");
const adminRouter = require("./routes/admin");

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Routes
app.use("/api/recs", recsRouter);
app.use("/api/likes", likesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/og", ogRouter);
app.use("/api/admin", adminRouter);

// Health check — visit localhost:4000/api/health to confirm server is running
app.get("/api/health", (req, res) => {
  res.json({ status: "Coffer server is running" });
});

module.exports = app;