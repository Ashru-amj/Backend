import { Router } from "express";
const router = Router();

import { Register, Login } from "../controller/authController.js";

router.post("/register", Register);

router.post("/login", Login);

export default  router;
