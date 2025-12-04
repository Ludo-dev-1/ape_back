import { generateToken } from "../utils/jwt.js";
import { Parents, Roles } from "../models/associations.js";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import { withTransaction } from "../utils/commonOperations.js";

const authController = {

    register: async (req, res, next) => {
        try {
            const { firstname, lastname, email, password, repeat_password, role_id } = req.body;

            if (password !== repeat_password) {
                return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });
            }

            const existingUser = await Parents.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà" });
            }

            const hash = await argon2.hash(password);

            const newUser = await Parents.create({
                prenom: firstname,
                nom: lastname,
                email,
                password: hash,
                role_id
            });

            res.status(201).json({
                message: "Utilisateur créé avec succès",
                user: {
                    id: newUser.id,
                    prenom: newUser.prenom,
                    nom: newUser.nom,
                    email: newUser.email
                }
            });

        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    ,
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Vérification des identifiants
            const user = await Parents.findOne({ where: { email } });
            if (!user) {
                const error = new Error("Identifiants invalides");
                error.statusCode = 401;
                throw error;
            }

            const isValid = await argon2.verify(user.password, password);
            if (!isValid) {
                const error = new Error("Identifiants invalides");
                error.statusCode = 401;
                throw error;
            }


            const token = generateToken({
                id: user.id,
                email: user.email,
                role_id: user.role_id
            });

            res.status(200).json({
                message: "Connexion réussie",
                token,
                user: {
                    id: user.id,
                    prenom: user.prenom,
                    nom: user.nom,
                    email: user.email,
                    role_id: user.role_id
                }
            });

            console.log("Token généré:", token);

        } catch (error) {
            next(error);
        }
    },
    getProfile: async (req, res, next) => {
        try {
            const userId = req.user.id;

            const user = await Parents.findByPk(userId, {
                include: [
                    {
                        model: Roles,
                        as: 'role',
                        attributes: ['nom'], // on récupère seulement le nom du rôle
                    },
                ],
                attributes: ['id', 'prenom', 'nom', 'email'], // on sélectionne les colonnes voulues
            });

            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            res.status(200).json({
                id: user.id,
                prenom: user.prenom,
                nom: user.nom,
                email: user.email,
                role: user.role ? user.role.nom : null, // 👈 rôle en texte, pas en id
            });

        } catch (error) {
            next(error);
        }
    },

    changePassword: async (req, res, next) => {
        console.log("Body reçu :", req.body);
        try {
            const userId = req.user.id;
            const { currentPassword, newPassword, confirmPassword } = req.body;

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });
            }

            const user = await Parents.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            const isValid = await argon2.verify(user.password, currentPassword);
            if (!isValid) {
                return res.status(401).json({ message: "Mot de passe actuel invalide" });
            }

            const hash = await argon2.hash(newPassword);
            user.password = hash;
            await user.save();

            res.status(200).json({ message: "Mot de passe modifié avec succès" });

        } catch (error) {
            next(error);
        }
    }

}

export default authController;