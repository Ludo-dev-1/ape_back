import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    define: { timestamps: true, createdAt: "created_at", updatedAt: "updated_at" },
});

export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Connexion à la base réussie !");
    } catch (err) {
        console.error("❌ Erreur de connexion à la base :", err);
    }
};
