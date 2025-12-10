import User from "../models/User.js";

// ==============================
// GET /api/users  (Admin only)
// ==============================
export const listUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ==============================
// PATCH /api/users/:id/role
// ==============================
export const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "Role updated successfully",
      user: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update role" });
  }
};

// ==============================
// PATCH /api/users/:id/suspend
// ==============================
export const suspendUser = async (req, res) => {
  try {
    const { suspendFeedback } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        isSuspended: true,
        suspendFeedback: suspendFeedback || "",
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "User suspended successfully",
      user: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to suspend user" });
  }
};
