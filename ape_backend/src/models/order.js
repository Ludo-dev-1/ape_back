// models/Order.js
import { DataTypes, Model } from "sequelize";
import sequelize from './database.js';

export class Order extends Model { }

Order.init(
    {
        status: {
            type: DataTypes.STRING,
            defaultValue: "pending", // pending | confirmed | delivered
        },
    },
    {
        sequelize,
        modelName: "order",
        tableName: "orders",
        timestamps: true,
        underscored: true
    }
);


