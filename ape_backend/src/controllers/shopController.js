import { Sale, Product, Order, OrderItem } from "../models/associations.js";

const shopController = {

    /** 🔹 GET toutes les ventes actives (avec produits) */
    getActiveSales: async (req, res) => {
        try {
            const sales = await Sale.findAll({
                where: { is_active: true },
                include: [{ model: Product, as: "products" }],
            });
            res.json(sales);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },
    /** 🔹 GET produits d’une vente */
    getProductsBySale: async (req, res) => {
        try {
            const sale = await Sale.findByPk(req.params.id, {
                include: [{ model: Product, as: "products" }],
            });
            if (!sale) return res.status(404).json({ message: "Vente non trouvée" });
            res.json(sale.products);
        } catch (error) {
            res.status(500).json({ message: "Erreur serveur" });
        }
    },
    /** 🔹 POST créer une commande pour un parent */
    createOrder: async (req, res) => {
        try {
            const { parent_id, sale_id, items } = req.body;
            const order = await Order.create(
                {
                    parent_id,
                    sale_id,
                    status: "pending",
                    items: items.map((i) => ({
                        product_id: i.product_id,
                        quantity: i.quantity,
                        price: i.price,
                    })),
                },
                {
                    include: [{ model: OrderItem, as: "items" }],
                }
            );
            res.status(201).json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    /** 🔹 GET une commande par son ID */
    getOrderById: async (req, res) => {
        try {
            const order = await Order.findByPk(req.params.id, {
                include: [{ model: OrderItem, as: "items" }],
            });
            if (!order) return res.status(404).json({ message: "Commande non trouvée" });
            res.json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    /** 🔹 DELETE une commande par son ID */
    deleteOrderById: async (req, res) => {
        try {
            const order = await Order.findByPk(req.params.id);
            if (!order) return res.status(404).json({ message: "Commande non trouvée" });
            await order.destroy();
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    /** 🔹 PUT mettre à jour une commande par son ID */
    updateOrderById: async (req, res) => {
        try {
            const order = await Order.findByPk(req.params.id);
            if (!order) return res.status(404).json({ message: "Commande non trouvée" });
            const { status, items } = req.body;
            order.status = status;
            order.items = items.map((i) => ({
                product_id: i.product_id,
                quantity: i.quantity,
                price: i.price,
            }));
            await order.save();
            res.json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    /** 🔹 GET toutes les commandes d’un parent */
    getOrdersByParent: async (req, res) => {
        try {
            const orders = await Order.findAll({
                where: { parent_id: req.params.parent_id },
                include: [{ model: OrderItem, as: "items" }],
            });
            res.json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },
};

export default shopController;