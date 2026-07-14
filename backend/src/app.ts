import express from "express";
import cors from "cors";
import pool from "./config/db";
import reviewRoutes from "./routes/review.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import blogRoutes from "./routes/blog.routes";
import contentRoutes from "./routes/content.routes";
import mediaRoutes from "./routes/media.routes";
import contactRoutes from "./routes/contact.routes";
import analyticsRoutes from "./routes/analytics.routes";
import publicRoutes from "./routes/public.routes";
import path from "path";



const app = express();

app.use(cors({
  origin: [
      "http://localhost:3000",
      "https://your-project.vercel.app",
    ],
    credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
// Register API routes
app.use("/api/review", reviewRoutes); // Keeps compatibility for public review submission
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/public", publicRoutes);

app.get("/", (_, res) => {
  res.send("Backend is running 🚀");
});

// Test Postgres connection
app.get("/test-db", async (_, res) => {
  try {
    const result = await pool.query(`SELECT * FROM review`);
    return res.json(result.rows);
  } catch (err: any) {
    console.error("GET /test-db error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default app;