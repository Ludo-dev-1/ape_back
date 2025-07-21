import { Model, DataTypes } from 'sequelize';
import sequelize from './database.js';


export class Roles extends Model { }

Roles.init({
    nom: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

}, {
    sequelize,
    tableName: "roles"
});





