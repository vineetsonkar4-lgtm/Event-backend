import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import path from "path";
import { connectDB } from "./config/db.js";

// ⭐ Clerk Middleware
import { clerkMiddleware } from "@clerk/express";

// ⭐ Routes
import businessProfileRouter from "./routes/businessProfileRouter.js";
import invoiceRouter from "./routes/invoiceRouter.js";
import aiInvoiceRouter from "./routes/aiInvoiceRouter.js";

const app = express();
const port = process.env.PORT || 4000;

// ⭐ Enable CORS for Clerk Session
app.use(
  cors({
    origin: "http://localhost:5173", // change in production
    credentials: true,
  })
);

// ⭐ Clerk middleware
app.use(clerkMiddleware());

// ⭐ Body parser
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// ⭐ Database Connection
connectDB();

// ⭐ Static uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ⭐ Routes
app.use("/api/businessProfile", businessProfileRouter);
app.use("/api/invoice", invoiceRouter);
app.use("/api/ai", aiInvoiceRouter);

// ⭐ Test route
app.get("/", (req, res) => {
  res.send("🚀 API Working with Clerk Auth + MongoDB");
});

// ⭐ Server Start (Local Only)
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`✅ Server Started on http://localhost:${port}`);
  });
}

// ⭐ Export app for Vercel
export default app;
