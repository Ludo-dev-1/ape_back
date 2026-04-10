import { Model, DataTypes } from "sequelize";
import { sequelize } from "./database.js";

export class Vote extends Model { }

Vote.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: "Sondage sans titre",
        },
        option: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: "votes",
        timestamps: true, // utilise created_at / updated_at
    }
);