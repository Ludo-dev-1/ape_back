import { Sequelize } from "./src/models/database.js";
import { Parents } from "./src/models";

async function insertTestParent() {
    try {
        const newParent = await Parents.create({
            nom: "Doe",
            prenom: "John",
            email: "john.doe@example.com",
            password: "securepassword",
            role_id: 1,
        });
        console.log("Nouveau parent inséré :", newParent.toJSON());
    } catch (error) {
        console.error("Erreur lors de l'insertion du parent :", error);
    }
}

insertTestParent();