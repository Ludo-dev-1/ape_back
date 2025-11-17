import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: new URL("../../.env", import.meta.url).pathname });

// Import de la config database
import { development as config } from "../config/config.js";

// Création de l'instance Sequelize
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
        logging: false,
    }
);

// Import des modèles
import { Parents } from "./parents.js";
import { Articles } from "./articles.js";
import { Evenements } from "./evenements.js";
import { Roles } from "./roles.js";
import { Product } from "./products.js";
import { Order } from "./order.js";
import { OrderItem } from "./orderItem.js";
import { Sale } from "./sale.js";

// Import des associations
import "./associations.js";


// Initialisation des modèles avec Sequelize
export {
    Parents,
    Articles,
    Evenements,
    Roles,
    Product,
    Order,
    OrderItem,
    Sale
};

// Définition des associations
// idem pour les autres modèles

// Synchronisation optionnelle (à utiliser avec prudence en prod)
// await sequelize.sync({ alter: true });

export { sequelize };
