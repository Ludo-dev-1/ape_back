import { Router } from "express";
import { authenticate, checkAdminAccess } from "../authenticate/auth.js";
import adminController from "../controllers/adminController.js";

const adminRouter = Router();
// Routes pour l'administration
adminRouter.get("/backoffice", authenticate, checkAdminAccess, adminController.getParentsWithRoles);
adminRouter.put("/backoffice/update-role/:email", authenticate, checkAdminAccess, adminController.updateRole);


export default adminRouter;