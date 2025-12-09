import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
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
