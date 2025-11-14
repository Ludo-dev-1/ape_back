import { log } from "console";
import { Roles, Parents, Sale, Product } from "../models/associations.js";
import { Op } from "sequelize";

const adminController = {
    getParentsWithRoles: async (req, res) => {
        try {
            const allParents = await Parents.findAll(
                {
                    include: {
                        model: Roles,
                        as: 'role',
                        attributes: ['id', 'nom']
                    }
                }
            );
            res.json(
                allParents.map(p => ({
                    nom: `${p.nom} ${p.prenom}`,
                    email: p.email,
                    roles: [{ id: p.role.id, nom: p.role.nom }]
                }))
            );
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    // Mettre à jour le rôle d'un parent
    updateRole: async (req, res) => {
        const { role_id } = req.body; // récupéré depuis le front
        const { email } = req.params;

        if (!role_id) {
            return res.status(400).json({ message: "Le role_id est requis" });
        }

        try {
            const parent = await Parents.findOne({ where: { email } });
            if (!parent) return res.status(404).json({ message: "Parent non trouvé" });

            await parent.setRole(role_id);

            // Récupérer à nouveau le parent avec son rôle pour renvoyer au front
            const updatedParent = await Parents.findOne({
                where: { email },
                include: { model: Roles, as: 'role', attributes: ['id', 'nom'] },
            });

            res.json({ message: "Rôle mis à jour", parent: updatedParent });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    },
    // Créer une vente avec ses produits
    // Créer une vente avec ses produits
    createSaleWithProducts: async (req, res) => {
        try {
            const { name, start_date, end_date } = req.body;

            // Parse des produits (venant du front sous forme de string JSON)
            let parsedProducts = [];
            if (Array.isArray(req.body.products)) {
                parsedProducts = req.body.products.map((p) =>
                    typeof p === "string" ? JSON.parse(p) : p
                );
            } else if (typeof req.body.products === "string") {
                parsedProducts = JSON.parse(req.body.products);
            }

            if (!name || !start_date || !end_date || !parsedProducts || parsedProducts.length === 0) {
                return res.status(400).json({ message: "Champs manquants" });
            }

            // Calcul automatique de is_active selon les dates
            const now = new Date();
            const start = new Date(start_date);
            const end = new Date(end_date);
            end.setHours(23, 59, 59, 999);

            const isActive = now >= start && now <= end;

            // Gestion de l'image de la vente
            let saleImagePath = null;
            if (req.files?.saleImage?.[0]) {
                saleImagePath = `/uploads/${req.files.saleImage[0].filename}`;
            }

            // Création de la vente
            const newSale = await Sale.create({
                name,
                start_date,
                end_date,
                is_active: isActive,
                picture: saleImagePath,
            });

            // Création des produits associés
            const products = await Promise.all(
                parsedProducts.map(async (prod, index) => {
                    const image = req.files?.productImages?.[index]?.filename;
                    return Product.create({
                        name: prod.name,
                        price: prod.price,
                        quantity: prod.quantity,
                        description: prod.description || "",
                        sale_id: newSale.id,
                        image_url: image ? `/uploads/${image}` : prod.image_url || null,
                    });
                })
            );

            return res.status(201).json({
                sale: newSale.toJSON(),
                products: products.map((p) => p.toJSON()),
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erreur serveur" });
        }
    },


    // Supprimer une vente et ses produits
    deleteSale: async (req, res) => {
        try {
            const sale = await Sale.findByPk(req.params.id, {
                include: { model: Product, as: "products" }
            });

            if (!sale) return res.status(404).json({ message: "Vente non trouvée" });

            // Supprimer d'abord les produits associés
            await Promise.all(sale.products.map(product => product.destroy()));

            // Puis supprimer la vente
            await sale.destroy();

            res.json({ message: "Vente et produits supprimés avec succès" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },


    getAllSales: async (req, res) => {
        try {
            const sales = await Sale.findAll();
            res.json(sales);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },


    getAllSalesWithProducts: async (req, res) => {
        try {
            const products = await Product.findAll({ where: { sale_id: req.params.saleId } });
            res.json(products);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    // Mettre à jour une vente et ses produits
    updateSaleWithProducts: async (req, res) => {
        try {
            const { name, start_date, end_date } = req.body;

            const sale = await Sale.findByPk(req.params.id, {
                include: { model: Product, as: "products" },
            });

            if (!sale) return res.status(404).json({ message: "Vente non trouvée" });

            // Parse products correctement avant la validation
            let parsedProducts = [];
            if (Array.isArray(req.body.products)) {
                parsedProducts = req.body.products.map((p) =>
                    typeof p === "string" ? JSON.parse(p) : p
                );
            } else if (typeof req.body.products === "string") {
                parsedProducts = JSON.parse(req.body.products);
            }

            if (!name || !start_date || !end_date || !parsedProducts || parsedProducts.length === 0) {
                return res.status(400).json({ message: "Champs manquants" });
            }

            // Calcul automatique de is_active selon les dates
            const now = new Date();
            const start = new Date(start_date);
            const end = new Date(end_date);
            end.setHours(23, 59, 59, 999); // inclure toute la journée de fin

            const isActive = now >= start && now <= end;

            // Mise à jour des infos de la vente
            sale.name = name;
            sale.start_date = start_date;
            sale.end_date = end_date;
            sale.is_active = isActive;

            if (req.files?.saleImage) {
                sale.picture = `/uploads/${req.files.saleImage[0].filename}`;
            }

            await sale.save();

            // Mettre à jour ou créer les produits liés
            const updatedProducts = await Promise.all(
                parsedProducts.map(async (prod, index) => {
                    const image = req.files?.productImages?.[index]?.filename;
                    const existingProduct = sale.products.find((p) => p.id === prod.id);

                    if (existingProduct) {
                        // Mettre à jour le produit existant
                        existingProduct.name = prod.name;
                        existingProduct.price = prod.price;
                        existingProduct.quantity = prod.quantity;
                        existingProduct.image_url = image
                            ? `/uploads/${image}`
                            : existingProduct.image_url;
                        await existingProduct.save();
                        return existingProduct;
                    } else {
                        // Créer un nouveau produit
                        return Product.create({
                            ...prod,
                            sale_id: sale.id,
                            image_url: image ? `/uploads/${image}` : prod.image_url || null,
                        });
                    }
                })
            );

            return res.status(200).json({
                sale: sale.toJSON(),
                products: updatedProducts.map((p) => p.toJSON()),
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erreur serveur" });
        }
    },


    deleteProduct: async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) return res.status(404).json({ message: "Produit non trouvé" });
            await product.destroy();
            res.json({ message: "Produit supprimé avec succès" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    deleteAccount: async (req, res) => {
        try {
            const parent = await Parents.findOne({ where: { email: req.params.email } });
            if (!parent) return res.status(404).json({ message: "Compte non trouvé" });
            await parent.destroy();
            res.json({ message: "Compte supprimé avec succès" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },


}

export default adminController;
