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
    }
};

export default adminController;
