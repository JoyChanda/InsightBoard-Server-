import express from "express";
import {
  listUsers,
  changeUserRole,
  suspendUser,
} from "../controllers/userController.js";

import { auth } from "../middleware/auth.js";
import { roleCheck } from "../middleware/roleCheck.js";

const router = express.Router();

// Superadmin/Admin: Get all users
router.get("/", auth, roleCheck(["superadmin", "admin"]), listUsers);

// Superadmin/Admin: Change user role
router.patch("/:id/role", auth, roleCheck(["superadmin", "admin"]), changeUserRole);

// Superadmin/Admin: Suspend a user
router.patch("/:id/suspend", auth, roleCheck(["superadmin", "admin"]), suspendUser);

export default router;
