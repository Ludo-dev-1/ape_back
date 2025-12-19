import { Router } from "express";
import authController from "../controllers/authController.js";
import { authenticate } from "../authenticate/auth.js";
import { validateRegister } from "../joiValidator/registerValidator.middleware.js";

const authRouter = Router();

// Routes pour l'authentification
authRouter.post("/login", authController.login);
authRouter.post("/register", validateRegister, authController.register);
authRouter.get("/profile", authenticate, authController.getProfile);
authRouter.post("/change-password", authenticate, authController.changePassword);
authRouter.delete("/delete-account/:email", authenticate, authController.deleteAccount);

export default authRouter;
