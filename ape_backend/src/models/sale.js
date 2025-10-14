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
        picture: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "sale",
        tableName: "sales",
        timestamps: true,
        underscored: true
    }

);

