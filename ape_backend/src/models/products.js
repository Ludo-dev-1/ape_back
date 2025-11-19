import { DataTypes, Model } from "sequelize";
import { sequelize } from './database.js';

export class Product extends Model { }

Product.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: DataTypes.TEXT,
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        image_url: DataTypes.STRING,
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        // 👇 clé étrangère vers la table sales
        sale_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "sales",
                key: "id",
            },
        },
    },
    {
        sequelize,
        modelName: "product",
        tableName: "products",
        timestamps: true,
        underscored: true,
    }
);


