import jwt from "jsonwebtoken";

// Main verification middleware
export const auth = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Start Aliases & Role Verification
export const verifyToken = auth;

export const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Superadmin only." });
    }
};

export const verifyManager = (req, res, next) => {
    if (req.user && ['manager', 'superadmin'].includes(req.user.role)) {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Managers only." });
    }
};
