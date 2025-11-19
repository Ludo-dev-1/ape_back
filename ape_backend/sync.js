// Importer tous les modèles AVANT sync
import "./src/models/index.js";
import { sequelize } from "./src/models/database.js";

try {
    await sequelize.sync({ alter: true }); // ou { force: true } si tu veux tout écraser
    console.log("🔥 Base synchronisée !");
} catch (error) {
    console.error("Erreur sync :", error);
}
