import { log } from "console";
import { Roles, Parents, Sale, Product } from "../models/associations.js";
import { Vote } from "../models/vote.js";
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
    createSaleWithProducts: async (req, res) => {
        try {
            const { name, start_date, end_date, saleImageUrl, productImagesMap } = req.body;

            let parsedProducts = JSON.parse(req.body.products);

            if (!name || !start_date || !end_date || parsedProducts.length === 0) {
                return res.status(400).json({ message: "Champs manquants" });
            }

            const now = new Date();
            const start = new Date(start_date);
            const end = new Date(end_date);
            end.setHours(23, 59, 59, 999);

            const isActive = now >= start && now <= end;

            // --- CRÉATION DE LA VENTE ---
            const newSale = await Sale.create({
                name,
                start_date,
                end_date,
                picture: saleImageUrl || null,  // <-- URL SUPABASE
                is_active: isActive,
            });

            // --- CRÉATION DES PRODUITS ---
            const createdProducts = await Promise.all(
                parsedProducts.map(prod => {
                    const imageUrl = productImagesMap[prod.tempId] || null;

                    return Product.create({
                        name: prod.name,
                        price: prod.price,
                        quantity: prod.stock,
                        description: prod.description,
                        sale_id: newSale.id,
                        image_url: imageUrl, // <-- URL SUPABASE
                    });
                })
            );

            return res.status(201).json({
                sale: newSale,
                products: createdProducts,
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

            // --- PARSING DES PRODUITS ---
            let parsedProducts = [];
            if (Array.isArray(req.body.products)) {
                parsedProducts = req.body.products.map((p) =>
                    typeof p === "string" ? JSON.parse(p) : p
                );
            } else if (typeof req.body.products === "string") {
                parsedProducts = JSON.parse(req.body.products);
            }

            if (!name || !start_date || !end_date || parsedProducts.length === 0) {
                return res.status(400).json({ message: "Champs manquants" });
            }

            // --- CALCUL IS_ACTIVE ---
            const now = new Date();
            const start = new Date(start_date);
            const end = new Date(end_date);
            end.setHours(23, 59, 59, 999);
            const isActive = now >= start && now <= end;

            // --- MISE A JOUR DE LA VENTE ---
            sale.name = name;
            sale.start_date = start_date;
            sale.end_date = end_date;
            sale.is_active = isActive;

            if (req.body.saleImageUrl) {
                sale.picture = req.body.saleImageUrl; // URL Supabase
            }

            await sale.save();


            // --- MISE A JOUR DES PRODUITS ---
            const existingIds = sale.products.map((p) => p.id);
            const incomingIds = parsedProducts.filter(p => p.id).map(p => p.id);

            // Suppression des anciens produits non présents dans la mise à jour
            for (const oldId of existingIds) {
                if (!incomingIds.includes(oldId)) {
                    await Product.destroy({ where: { id: oldId } });
                }
            }

            const updatedProducts = [];

            for (const prod of parsedProducts) {
                const imageUrl =
                    req.body.productImagesMap?.[prod.tempId] || // nouvelle image uploadée
                    prod.image_url ||                            // ancienne image conservée
                    null;

                if (prod.id) {
                    // --- PRODUIT EXISTANT ---
                    const existingProduct = sale.products.find((p) => p.id === prod.id);

                    if (existingProduct) {
                        existingProduct.name = prod.name;
                        existingProduct.price = prod.price;
                        existingProduct.quantity = prod.quantity ?? 0;
                        existingProduct.description = prod.description || "";
                        existingProduct.image_url = imageUrl;

                        await existingProduct.save();
                        updatedProducts.push(existingProduct);
                        continue;
                    }
                }

                // --- NOUVEAU PRODUIT ---
                const newProduct = await Product.create({
                    name: prod.name,
                    price: prod.price,
                    quantity: prod.quantity ?? 0,
                    description: prod.description || "",
                    sale_id: sale.id,
                    image_url: imageUrl
                });

                updatedProducts.push(newProduct);
            }

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

    // ===== VOTES / SONDAGE =====

    // Mettre à jour le titre du sondage
    updatePollTitle: async (req, res) => {
        try {
            const { title } = req.body;

            if (!title || !title.trim()) {
                return res.status(400).json({ message: "Le titre du sondage est requis" });
            }

            // Récupérer tous les votes et mettre à jour leur titre
            // (Supposant un seul sondage avec le même titre pour tous les votes)
            const votes = await Vote.findAll();

            if (votes.length === 0) {
                return res.status(404).json({ message: "Aucun vote trouvé" });
            }

            // Mettre à jour tous les votes avec le nouveau titre
            await Promise.all(
                votes.map(vote =>
                    vote.update({ title: title.trim() })
                )
            );

            res.json({
                message: "Le titre du sondage a été mis à jour",
                title: title.trim()
            });
        } catch (error) {
            console.error("Erreur mise à jour titre sondage:", error);
            res.status(500).json({ message: error.message || "Erreur serveur" });
        }
    },

    // Mettre à jour une option de vote (choice)
    updateVoteOption: async (req, res) => {
        try {
            const { id } = req.params;
            const { option } = req.body;

            if (!option || !option.trim()) {
                return res.status(400).json({ message: "Le libellé du choix est requis" });
            }

            const vote = await Vote.findByPk(id);

            if (!vote) {
                return res.status(404).json({ message: "Option de vote non trouvée" });
            }

            // Mettre à jour l'option
            await vote.update({
                option: option.trim()
            });

            res.json({
                message: "L'option de vote a été mise à jour",
                choice: {
                    id: vote.id,
                    option: vote.option,
                    count: vote.count
                }
            });
        } catch (error) {
            console.error("Erreur mise à jour option vote:", error);
            res.status(500).json({ message: error.message || "Erreur serveur" });
        }
    },

    // Supprimer une option de vote
    deleteVoteOption: async (req, res) => {
        try {
            const { id } = req.params;

            const vote = await Vote.findByPk(id);

            if (!vote) {
                return res.status(404).json({ message: "Option de vote non trouvée" });
            }

            await vote.destroy();

            res.json({
                message: "L'option de vote a été supprimée",
                deletedId: id
            });
        } catch (error) {
            console.error("Erreur suppression option vote:", error);
            res.status(500).json({ message: error.message || "Erreur serveur" });
        }
    },

    // Récupérer tous les votes (options du sondage)
    getAllVotes: async (req, res) => {
        try {
            const votes = await Vote.findAll({
                order: [['createdAt', 'ASC']]
            });

            if (votes.length === 0) {
                return res.json({
                    title: "Sondage sans titre",
                    choices: []
                });
            }

            const title = votes[0].title;
            const choices = votes.map(vote => ({
                id: vote.id,
                option: vote.option,
                count: vote.count
            }));

            res.json({
                title,
                choices
            });
        } catch (error) {
            console.error("Erreur récupération votes:", error);
            res.status(500).json({ message: error.message || "Erreur serveur" });
        }
    },


}

export default adminController;
