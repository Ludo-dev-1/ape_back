import { generateToken } from "../utils/jwt.js";
import { Parents } from "../models/associations.js";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import { withTransaction } from "../utils/commonOperations.js";

const authController = {
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await Parents.findOne({ where: { email } });

            if (!user) {
                return res.status(401).json({ message: "Email ou mot de passe incorrect" });
            }

            const isValid = await argon2.verify(user.password, password);

            if (!isValid) {
                return res.status(401).json({ message: "Email ou mot de passe incorrect" });
            }

            const token = generateToken(user);
            return res.json({ token });
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            return res.status(500).json({ message: "Erreur serveur" });
        }
    },

    register: async (req, res) => {
        const verificationToken = uuidv4();
        try {
            const { firstname, lastname, email, password, repeat_password, role_id } = req.body;

            const result = await withTransaction(async (transaction) => {
                // Vérification de l'existence de l'utilisateur
                const existingUser = await Parents.findOne({ where: { email }, transaction });
                if (existingUser) {
                    const error = new Error("Une erreur s'est produite lors de la création du compte");
                    error.statusCode = 400;
                    throw error;
                }

                const hash = await argon2.hash(password);

                // Création de l'utilisateur
                const newUser = await Parents.create({
                    firstname,
                    lastname,
                    email,
                    password: hash,
                    role_id,
                    emailVerified: false,
                    verificationToken
                }, { transaction });


                return newUser;
            });

            res.status(201).json({
                message: "Utilisateur créé avec succès",
                user: {
                    id: result.id,
                    firstname: result.firstname,
                    lastname: result.lastname,
                    email: result.email
                }
            });
        } catch (error) {
            next(error);
        };
    },
}

export default authController;