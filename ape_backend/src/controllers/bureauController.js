import { Articles, Evenements } from '../models/associations.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bureauController = {
    // ➤ Articles
    createArticle: async (req, res) => {
        try {
            const { titre, contenu, contenu_bref } = req.body;
            const image = req.file ? `/uploads/${req.file.filename}` : null;

            const newArticle = await Article.create({
                titre,
                contenu,
                contenu_bref,
                image
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
            const { titre, contenu, contenu_bref } = req.body;
            const article = await Articles.findByPk(id);

            if (!article) return res.status(404).json({ message: "Article non trouvé" });

            // Si une nouvelle image est uploadée, on met à jour le chemin
            if (req.file) {
                article.image = `/uploads/${req.file.filename}`;
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
            const { titre, description, date_event } = req.body;
            const image = req.file ? `/uploads/${req.file.filename}` : null;

            const newEvent = await Evenements.create({
                titre,
                description,
                date_event,
                image
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
            const { titre, description, date_event } = req.body;
            const event = await Evenements.findByPk(id);

            if (!event) return res.status(404).json({ message: "Événement non trouvé" });

            if (req.file) {
                event.image = `/uploads/${req.file.filename}`;
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
