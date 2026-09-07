import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Authorization header check
    if (!authHeader) {
      return res.status(401).json({
        message: "Not authorized, no token provided",
      });
    }

    // Expected: Bearer <token>
    const [scheme, token] = authHeader.trim().split(/\s+/);

    if (scheme?.toLowerCase() !== "bearer" || !token) {
      return res.status(401).json({
        message: "Not authorized, invalid authorization header",
      });
    }

    // JWT must have 3 parts
    if (token.split(".").length !== 3) {
      console.error("Invalid JWT received:", token);

      return res.status(401).json({
        message: "Not authorized, malformed token",
      });
    }

    const secret =
      process.env.JWT_SECRET || "niela_default_secret_key";

    const decoded = jwt.verify(token, secret);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized, user not found",
      });
    }

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Not authorized, token expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Not authorized, invalid token",
      });
    }

    return res.status(500).json({
      message: "Authentication error",
    });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Forbidden, administrator access required",
    });
  }
};