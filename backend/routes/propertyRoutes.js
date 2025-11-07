import express from "express";
import multer from "multer";
import Property from "../models/Property.js";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Auth Middleware (Verify Admin Token)
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Check for isAdmin flag instead of role
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Access denied, admin only" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Add Property (Protected)
router.post("/", verifyAdmin, upload.array("images", 5), async (req, res) => {
  try {
    const { title, location, SBU, CA, furnishing, propertyFor, type } = req.body;
    const imagePaths = req.files?.map(file => `/uploads/${file.filename}`) || [];

    const property = new Property({
      title,
      location,
      SBU,
      CA,
      furnishing,
      propertyFor,
      type,
      images: imagePaths,
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: "Error adding property", error });
  }
});

// ✅ Get All Properties (Public) with Filtering Support
router.get("/", async (req, res) => {
  try {
    const { location, propertyFor } = req.query; // read query parameters from frontend
    const query = {};

    if (location) {
      query.location = { $regex: location, $options: "i" }; // case-insensitive match
    }

    if (propertyFor) {
      query.propertyFor = { $regex: propertyFor, $options: "i" };
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    console.error("Error fetching filtered properties:", error);
    res.status(500).json({ message: "Error fetching properties" });
  }
});


// ✅ Get Single Property (Public)
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Error fetching property", error });
  }
});

// ✅ Update Property (Protected)
router.put("/:id", verifyAdmin, upload.array("images", 5), async (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "Property not found" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating property", error });
  }
});

// ✅ Delete Property (Protected)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    // Remove images
    if (property.images?.length) {
      property.images.forEach(img => {
        const fileName = img.replace("/uploads/", "");
        const filePath = path.resolve("uploads", fileName);
        if (fs.existsSync(filePath)) fs.unlink(filePath, () => {});
      });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting property", error });
  }
});

export default router;
