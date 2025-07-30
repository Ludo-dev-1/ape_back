import { Model, DataTypes } from 'sequelize';
import sequelize from './database.js';


export class Evenements extends Model { }

Evenements.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titre: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    date_event: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
},
    {
        sequelize,
        tableName: "evenements",
        timestamps: false, // Ajoute les champs createdAt et updatedAt
    });





