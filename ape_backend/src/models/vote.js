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
        option: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "votes",
        timestamps: true, // utilise created_at / updated_at
    }
);