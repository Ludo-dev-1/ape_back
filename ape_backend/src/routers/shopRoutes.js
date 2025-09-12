// routes/shopRoutes.js
import express from "express";
import shopController from "../controllers/shopController.js";

const router = express.Router();


//GET toutes les ventes actives (avec produits)
router.get("/sales", shopController.getActiveSales);


//GET produits d’une vente
router.get("/sales/:id/products", shopController.getProductsBySale);

// POST créer une commande pour un parent
router.post("/orders", shopController.createOrder);


// POST créer une commande pour un parent
router.post("/orders", shopController.createOrder);


// GET toutes les commandes d’un parent
router.get("/parents/:id/orders", shopController.getOrdersByParent);


// PATCH mettre à jour le statut d’une commande
router.patch("/orders/:id", shopController.updateOrderById);

export default router;
