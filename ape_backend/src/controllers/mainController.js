import { Articles, Parents } from "../models/associations.js";


const mainController = {
    createArticle: async (req, res) => {
        try {
            const parentId = req.user.id;

            const parent = await Parents.findByPk(parentId, {
                include: { model: Role, as: 'role' }
            });

            if (!parent || parent.role.nom !== 'membre_ape') {
                return res.status(403).json({ message: "Accès refusé : seuls les membres de l'APE peuvent créer des articles." });
            }

            const article = await Articles.create({
                titre: req.body.titre,
                contenu: req.body.contenu,
                auteur_id: parentId,
            });

            res.status(201).json(article);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getArticles: async (req, res) => {
        try {
            const articles = await Articles.findAll({
                include: {
                    model: Parents,
                    as: 'auteur',
                    attributes: ['id', 'nom', 'prenom']
                }
            });
            res.status(200).json(articles);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getArticle: async (req, res) => {
        try {
            const article = await Articles.findByPk(req.params.id, {
                include: {
                    model: Parents,
                    as: 'auteur',
                    attributes: ['id', 'nom', 'prenom']
                }
            });

            if (!article) {
                return res.status(404).json({ message: "Article non trouvé." });
            }

            res.status(200).json(article);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

}

export default mainController;