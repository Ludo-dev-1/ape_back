import { Roles, Parents } from "../models/associations.js";

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
                    roles: [{ nom: p.role.nom }]
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
    }

};

export default adminController;
