import { Router } from "express";
import authController from "../controllers/authController.js";
import { authenticate } from "../authenticate/auth.js";

const authRouter = Router();

// Routes pour l'authentification
authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.get("/profile", authenticate, authController.getProfile);
authRouter.post("/change-password", authenticate, authController.changePassword);

export default authRouter;
