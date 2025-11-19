import sequelize from './src/models/database.js';

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Connexion à la base de données réussie !");
        process.exit(0);
    } catch (err) {
        console.error("❌ Impossible de se connecter à la base :", err);
        process.exit(1);
    }
};

testConnection();
