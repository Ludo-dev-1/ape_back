import { Model, DataTypes } from "sequelize";
import { sequelize } from "./database.js";

export class Parents extends Model { }

Parents.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nom: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        prenom: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "parents",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);
