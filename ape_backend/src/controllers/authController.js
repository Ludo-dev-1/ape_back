import { generateToken } from "../utils/jwt.js";
import { Parents } from "../models/associations.js";
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

            // Génération du token
            const token = generateToken(user.id);

            res.status(200).json({
                message: "Connexion réussie",
                token
            });

            console.log(token);

        } catch (error) {
            next(error);
        }
    }
}

export default authController;