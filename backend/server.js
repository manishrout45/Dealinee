import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import adminAuth from "./routes/adminAuth.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import { adminProtect } from "./middleware/adminProtect.js";

dotenv.config();
const app = express();

// Fix dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// Routes
app.use("/api/admin", adminAuth); // Login route
app.use("/api/admin/properties", adminProtect, propertyRoutes); // Protected routes

// Public property routes (no admin middleware)
import propertyRoutesPublic from "./routes/propertyRoutes.js";
app.use("/api/properties", propertyRoutesPublic);


// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
