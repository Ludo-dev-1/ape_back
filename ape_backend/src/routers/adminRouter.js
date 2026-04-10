import { Router } from "express";
import multer from "multer";
import path from "path";
import { authenticate, checkAdminAccess } from "../authenticate/auth.js";
import adminController from "../controllers/adminController.js";
import { uploadBufferToSupabase } from '../../supabaseClient.js';

const adminRouter = Router();

// Multer en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes admin classiques
adminRouter.get("/backoffice", authenticate, checkAdminAccess, adminController.getParentsWithRoles);
adminRouter.put("/backoffice/update-role/:email", authenticate, checkAdminAccess, adminController.updateRole);

// Route pour créer une vente avec ses images
adminRouter.post(
    "/sales",
    authenticate,
    checkAdminAccess,
    upload.any(), // accepte tout productImage_xxx
    async (req, res, next) => {
        try {
            const files = req.files;

            // Upload image de la vente
            const saleFile = files.find(f => f.fieldname === "saleImage");
            if (saleFile) {
                req.body.saleImageUrl = await uploadBufferToSupabase(
                    saleFile.buffer,
                    Date.now() + path.extname(saleFile.originalname)
                );
            }

            // Upload images produits
            req.body.productImagesMap = {};

            for (const file of files) {
                if (file.fieldname.startsWith("productImage_")) {
                    const tempId = file.fieldname.replace("productImage_", "");
                    const url = await uploadBufferToSupabase(
                        file.buffer,
                        Date.now() + path.extname(file.originalname)
                    );
                    req.body.productImagesMap[tempId] = url;
                }
            }

            await adminController.createSaleWithProducts(req, res);

        } catch (err) {
            next(err);
        }
    }
);
// Mise à jour d’une vente avec images
adminRouter.patch(
    "/sales/:id",
    authenticate,
    checkAdminAccess,
    upload.any(),
    async (req, res, next) => {
        try {
            // Upload saleImage s'il existe
            const saleImageFile = req.files.find(f => f.fieldname === "saleImage");
            if (saleImageFile) {
                req.body.saleImageUrl = await uploadBufferToSupabase(
                    saleImageFile.buffer,
                    Date.now() + path.extname(saleImageFile.originalname)
                );
            }

            // Construire une map productImages: { tempId : urlSupabase }
            req.body.productImagesMap = {};

            for (const file of req.files) {
                if (file.fieldname.startsWith("productImage_")) {
                    const tempId = file.fieldname.replace("productImage_", "");
                    req.body.productImagesMap[tempId] = await uploadBufferToSupabase(
                        file.buffer,
                        Date.now() + path.extname(file.originalname)
                    );
                }
            }

            await adminController.updateSaleWithProducts(req, res);
        } catch (err) {
            next(err);
        }
    }
);


adminRouter.delete("/sales/:id", authenticate, checkAdminAccess, adminController.deleteSale);
adminRouter.get("/sales", authenticate, checkAdminAccess, adminController.getAllSales);
adminRouter.get("/sales/:saleId/products", authenticate, checkAdminAccess, adminController.getAllSalesWithProducts);
adminRouter.delete("/products/:id", authenticate, checkAdminAccess, adminController.deleteProduct);
adminRouter.delete("/account/:email", authenticate, checkAdminAccess, adminController.deleteAccount);

// Routes Votes / Sondage
adminRouter.get("/votes", authenticate, checkAdminAccess, adminController.getAllVotes);
adminRouter.put("/votes/title", authenticate, checkAdminAccess, adminController.updatePollTitle);
adminRouter.put("/votes/:id", authenticate, checkAdminAccess, adminController.updateVoteOption);
adminRouter.delete("/votes/:id", authenticate, checkAdminAccess, adminController.deleteVoteOption);

export default adminRouter;
