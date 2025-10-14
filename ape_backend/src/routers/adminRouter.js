import { Router } from "express";
import { authenticate, checkAdminAccess } from "../authenticate/auth.js";
import adminController from "../controllers/adminController.js";
import multer from "multer";
import path from "path";


const adminRouter = Router();

// Multer pour gérer l'upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // dossier déjà servi statiquement
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Routes pour l'administration
adminRouter.get(
    "/backoffice",
    authenticate,
    checkAdminAccess,
    adminController.getParentsWithRoles
);

adminRouter.put(
    "/backoffice/update-role/:email",
    authenticate,
    checkAdminAccess,
    adminController.updateRole
);

// Route pour créer une vente avec ses produits et images
adminRouter.post(
    "/sales",
    authenticate,
    checkAdminAccess,
    upload.fields([
        { name: "saleImage", maxCount: 1 },
        { name: "productImages" } // tableau d’images produits
    ]),
    adminController.createSaleWithProducts
);

// Supprimer une vente
adminRouter.delete(
    "/sales/:id",
    authenticate,
    checkAdminAccess,
    adminController.deleteSale
);

// Mettre à jour une vente
adminRouter.patch(
    "/sales/:id",
    authenticate,
    checkAdminAccess,
    upload.fields([
        { name: "saleImage", maxCount: 1 },
        { name: "productImages", maxCount: 10 },
    ]),
    adminController.updateSaleWithProducts
);
// Récupérer toutes les ventes avec leurs produits

adminRouter.get(
    "/sales/:saleId/products",
    authenticate,
    checkAdminAccess,
    adminController.getAllSalesWithProducts
);

adminRouter.delete(
    "/products/:id",
    authenticate,
    checkAdminAccess,
    adminController.deleteProduct
);

export default adminRouter;
