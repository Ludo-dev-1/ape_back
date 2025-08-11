import { Model, DataTypes } from 'sequelize';
import sequelize from './database.js';
import { Roles } from '../models/associations.js';


export class Parents extends Model { }

Parents.init({
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
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Roles,
            key: 'id',
        },
        allowNull: true,
    }

}, {
    sequelize,
    tableName: "parents",
    timestamps: false,
    createdAt: "created_at",
    updatedAt: "updated_at"
});





