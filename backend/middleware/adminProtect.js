import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function adminProtect(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token. Access denied" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
