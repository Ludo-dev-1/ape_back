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
        created_at: {
            type: DataTypes.DATE,
            field: "created_at"
        },
        updated_at: {
            type: DataTypes.DATE,
            field: "updated_at"
        }
    },
    {
        sequelize,
        tableName: "votes",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);
