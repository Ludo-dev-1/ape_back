import { Articles, Evenements } from "../models/associations.js";

const bureauController = {
    createArticle: async (req, res) => {
        const { titre, contenu_bref, contenu } = req.body;
        console.log("Received data:", req.body);
        console.log("req.file:", req.file);

        try {
            const newArticle = await Articles.create({
                titre,
                contenu_bref,
                contenu,
                image: `../uploads/${req.file.filename}`,
                date_publication: new Date(),
                auteur_id: 1,  // ou req.user.id si défini
            });

            res.status(201).json(newArticle);
        } catch (error) {
            console.error("Erreur createArticle:", error);
            res.status(500).json({ message: "Erreur lors de la création de l'article", error });
        }
    },
    deleteArticle: async (req, res) => {
        const { id } = req.params;

        try {
            const article = await Articles.findByPk(id);
            if (!article) {
                return res.status(404).json({ message: "Article non trouvé" });
            }

            await article.destroy();
            res.status(200).json({ message: "Article supprimé avec succès" });
        } catch (error) {
            console.error("Erreur deleteArticle:", error);
            res.status(500).json({ message: "Erreur lors de la suppression de l'article", error });
        }
    },
    updateArticle: async (req, res) => {
        const { id } = req.params;
        const { titre, contenu_bref, contenu } = req.body;

        try {
            const article = await Articles.findByPk(id);
            if (!article) {
                return res.status(404).json({ message: "Article non trouvé" });
            }

            article.titre = titre;
            article.contenu_bref = contenu_bref;
            article.contenu = contenu;

            if (req.file) {
                article.image = `/uploads/${req.file.filename}`;
            }

            await article.save();
            res.status(200).json(article);
        } catch (error) {
            console.error("Erreur updateArticle:", error);
            res.status(500).json({ message: "Erreur lors de la mise à jour de l'article", error });
        }
    },
    createEvent: async (req, res) => {
        const { titre, description, date_event } = req.body;

        try {
            const newEvent = await Evenements.create({
                titre,
                description,
                date_event: new Date(date_event),
                image: req.file ? `/uploads/${req.file.filename}` : null,
                auteur_id: 1,  // ou req.user.id si défini
            });
            console.log("Image chargée:", newEvent.image);
            res.status(201).json(newEvent);
        } catch (error) {
            console.error("Erreur createEvent:", error);
            res.status(500).json({ message: "Erreur lors de la création de l'événement", error });
        }
    },

}

export default bureauController;
