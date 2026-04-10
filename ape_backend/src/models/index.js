// src/models/index.js
import { sequelize } from "./database.js";

// Import des modèles
import { Parents } from "./parents.js";
import { Articles } from "./articles.js";
import { Evenements } from "./evenements.js";
import { Roles } from "./roles.js";
import { Product } from "./products.js";
import { Order } from "./order.js";
import { OrderItem } from "./orderItem.js";
import { Sale } from "./sale.js";
import { Vote } from "./vote.js";

// Import des associations
import "./associations.js";

export {
    Parents,
    Articles,
    Evenements,
    Roles,
    Product,
    Order,
    OrderItem,
    Sale,
    Vote,
    sequelize,
};