import { Sequelize } from 'sequelize';
import { development as config } from '../config/config.js';

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        define: {
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

// Fonction de connexion à la base de données
export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connexion à la base réussie !');
    } catch (error) {
        console.error('❌ Erreur de connexion à la base :', error);
    }
};
export default sequelize;
