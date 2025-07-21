import { Articles } from "../models/associations.js";

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
                image: `/uploads/${req.file.filename}`,
                date_publication: new Date(),
                auteur_id: 1,  // ou req.user.id si défini
            });

            res.status(201).json(newArticle);
        } catch (error) {
            console.error("Erreur createArticle:", error);
            res.status(500).json({ message: "Erreur lors de la création de l'article", error });
        }
    },

}

export default bureauController;
