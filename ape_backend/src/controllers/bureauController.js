import { Articles, Evenements } from '../models/associations.js';

const bureauController = {
    // ➤ Articles
    createArticle: async (req, res) => {
        try {
            const { titre, contenu, contenu_bref, imageUrl } = req.body;

            const newArticle = await Articles.create({
                titre,
                contenu,
                contenu_bref,
                image: imageUrl || null  // <-- Supabase URL
            });

            res.status(201).json(newArticle);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    updateArticle: async (req, res) => {
        try {
            const { id } = req.params;
            const { titre, contenu, contenu_bref, imageUrl } = req.body;

            const article = await Articles.findByPk(id);
            if (!article) return res.status(404).json({ message: "Article non trouvé" });

            if (imageUrl) {
                article.image = imageUrl;  // <-- Remplace l'image si nouvelle URL Supabase
            }

            article.titre = titre;
            article.contenu = contenu;
            article.contenu_bref = contenu_bref;

            await article.save();

            res.status(200).json(article);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    deleteArticle: async (req, res) => {
        try {
            const { id } = req.params;
            const article = await Articles.findByPk(id);
            if (!article) return res.status(404).json({ message: "Article non trouvé" });

            await article.destroy();
            res.status(200).json({ message: "Article supprimé" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    // ➤ Événements
    createEvent: async (req, res) => {
        try {
            const { titre, description, date_event, imageUrl } = req.body;

            const newEvent = await Evenements.create({
                titre,
                description,
                date_event,
                image: imageUrl || null  // <-- Supabase URL
            });

            res.status(201).json(newEvent);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    updateEvent: async (req, res) => {
        try {
            const { id } = req.params;
            const { titre, description, date_event, imageUrl } = req.body;

            const event = await Evenements.findByPk(id);
            if (!event) return res.status(404).json({ message: "Événement non trouvé" });

            if (imageUrl) {
                event.image = imageUrl;  // <-- Remplace l'image si nouvelle URL Supabase
            }

            event.titre = titre;
            event.description = description;
            event.date_event = date_event;

            await event.save();

            res.status(200).json(event);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const { id } = req.params;
            const event = await Evenements.findByPk(id);
            if (!event) return res.status(404).json({ message: "Événement non trouvé" });

            await event.destroy();
            res.status(200).json({ message: "Événement supprimé" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    }
};

export default bureauController;
