import { Router } from "express";
import adminController from "../controllers/adminController.js";

const adminRouter = Router();
// Routes pour l'administration
adminRouter.get("/backoffice", adminController.getParentsWithRoles);


export default adminRouter;
