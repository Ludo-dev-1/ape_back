import { DataTypes } from "sequelize";
import { sequelize } from "./database.js";

export class Vote extends Model { }

Vote.init({
    option: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
}, {
    sequelize,
    tableName: "votes",
    timestamps: false,
});

