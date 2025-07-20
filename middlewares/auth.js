import jsonwebtoken from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (user) => {
  return jsonwebtoken.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
};

const checkBuyer = async (req, res, next) => {
  if (req.user.role !== "buyer") {
    return res.status(403).json({ message: "Access denied, buyer only" });
  }
  next();
};
const checkSeller = async (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({ message: "Access denied, seller only" });
  }
  next();
};
const checkAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
  next();
};

export { generateToken, authMiddleware, checkBuyer, checkSeller, checkAdmin };
