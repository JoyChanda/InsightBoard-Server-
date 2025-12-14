import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "buyer",
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Logout
export const logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: false, // process.env.NODE_ENV === "production",
      sameSite: "lax"
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};

// Verify - Check if user is authenticated
export const verify = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.status(200).json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Social Login Sync
export const socialLogin = async (req, res) => {
  try {
    const { displayName, email, photoURL } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user in MongoDB with default role (e.g., 'buyer')
      user = await User.create({
        name: displayName || "User",
        email,
        photoURL,
        role: "buyer",
      });
    } else {
        // Optional: Update photoURL if changed
        if (photoURL && user.photoURL !== photoURL) {
            user.photoURL = photoURL;
            await user.save();
        }
    }

    // Issue JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send token as cookie or JSON
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // process.env.NODE_ENV === "production" -> Force false for localhost debug
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ 
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
       });
  } catch (err) {
    console.error("Social login error:", err);
    res.status(500).json({ message: "Server error during social sync" });
  }
};
// Get Current User
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
