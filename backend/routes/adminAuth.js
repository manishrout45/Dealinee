import express from "express"; 
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {

    // ✅ Admin token with isAdmin flag
    const token = jwt.sign(
      { username, isAdmin: true }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    return res.json({ success: true, token });
  }

  return res.status(401).json({ success: false, message: "Invalid credentials" });
});

export default router;
