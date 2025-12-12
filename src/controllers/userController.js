import User from "../models/User.js";

// ==============================
// GET /api/users?search=john&role=admin
// ==============================
export const listUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ==============================
// PATCH /api/users/:id/role  (Handles Role & Status updates)
// ==============================
export const changeUserRole = async (req, res) => {
  try {
    const { role, status, suspendReason } = req.body;
    const updates = {};

    if (role) updates.role = role;
    if (status) updates.status = status;
    if (suspendReason) updates.suspendReason = suspendReason;
    
    // Clear suspend reason if activating
    if (status === "active") {
        updates.suspendReason = "";
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      user: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Deprecated or alias to above if needed, but route uses changeUserRole
export const suspendUser = changeUserRole;
