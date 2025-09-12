// models/Sale.js
import { DataTypes, Model } from "sequelize";
import sequelize from './database.js';

export class Sale extends Model { }

Sale.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "sale",
        tableName: "sales", // important si ta table est en snake_case
        timestamps: true,
        underscored: true  // 👉 Sequelize attendra created_at / updated_at
    }

);

