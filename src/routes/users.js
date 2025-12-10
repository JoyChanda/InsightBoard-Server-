import express from "express";
import {
  listUsers,
  changeUserRole,
  suspendUser,
} from "../controllers/userController.js";

import { auth } from "../middleware/auth.js";
import { roleCheck } from "../middleware/roleCheck.js";

const router = express.Router();

// Admin: Get all users
router.get("/", auth, roleCheck(["admin"]), listUsers);

// Admin: Change user role
router.patch("/:id/role", auth, roleCheck(["admin"]), changeUserRole);

// Admin: Suspend a user
router.patch("/:id/suspend", auth, roleCheck(["admin"]), suspendUser);

export default router;
