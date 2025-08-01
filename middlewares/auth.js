import jsonwebtoken from "jsonwebtoken";
import User from "../models/user.model.js";

const generateToken = (user) => {
  return jsonwebtoken.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" } 
  );
};

const authMiddleware = async (req, res, next) => {
  let token;
  
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized access - No token provided" });
  }
  
  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); 
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    
    if (req.cookies.token) {
      res.clearCookie("token");
    }
    
    return res.status(401).json({ 
      message: "Unauthorized access - Invalid token",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const checkBuyer = async (req, res, next) => {
  if (req.user.role !== "buyer") {
    return res.status(403).json({ message: "Access denied - Buyer role required" });
  }
  next();
};

const checkSeller = async (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({ message: "Access denied - Seller role required" });
  }
  next();
};

const checkAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied - Admin role required" });
  }
  next();
};

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied - Required roles: ${roles.join(', ')}` 
      });
    }
    next();
  };
};

export { generateToken, authMiddleware, checkBuyer, checkSeller, checkAdmin, checkRole };