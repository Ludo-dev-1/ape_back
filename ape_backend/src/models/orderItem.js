// models/OrderItem.js
import { DataTypes, Model } from "sequelize";
import sequelize from './database.js';

export class OrderItem extends Model { }

OrderItem.init(
    {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false, // prix figé au moment de la commande
        },
    },
    {
        sequelize,
        modelName: "order_item",
        tableName: "order_items",
        timestamps: true,
        underscored: true
    }
);


