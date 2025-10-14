import sequelize from '../../src/models/database.js';
import { Roles } from './roles.js';
import { Parents } from './parents.js';
import { Evenements } from './evenements.js';
import { Articles } from './articles.js';
import { Sale } from "./sale.js";
import { Order } from "./order.js";
import { OrderItem } from "./orderItem.js";
import { Product } from "./products.js";


// Associations belongs to
Parents.belongsTo(Roles, { foreignKey: 'role_id', as: 'role' });
Articles.belongsTo(Parents, { foreignKey: 'auteur_id', as: 'auteur' });

// 1 vente → plusieurs produits
Sale.hasMany(Product, { foreignKey: "sale_id", as: "products" });
Product.belongsTo(Sale, { foreignKey: "sale_id", as: "sale" });

// 1 parent → plusieurs commandes
Parents.hasMany(Order, { foreignKey: "parent_id", as: "orders" });
Order.belongsTo(Parents, { foreignKey: "parent_id", as: "parent" });

// 1 vente → plusieurs commandes
Sale.hasMany(Order, { foreignKey: "sale_id", as: "orders" });
Order.belongsTo(Sale, { foreignKey: "sale_id", as: "sale" });

// 1 commande → plusieurs items
Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// 1 produit → plusieurs items (dans différentes commandes)
Product.hasMany(OrderItem, { foreignKey: "product_id", as: "order_items" })


// Associations has many
Parents.hasMany(Articles, { foreignKey: 'auteur_id', as: 'articles' });




export { Parents, Roles, Evenements, Articles, Sale, Order, OrderItem, Product, sequelize };