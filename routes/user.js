import { Router } from "express";
const router = Router();

import authenticateUser from "../middleware/authMiddleware.js";
import {
  userRegister,
  userLogin,
  userProfile,
}  from "../controller/userController.js";

// Register a new user
router.post("/users/register", userRegister);

// Login
router.post("/users/login", userLogin);

// Update user profile
router.put("/users/:userId/profile", authenticateUser, userProfile);

export default  router;
