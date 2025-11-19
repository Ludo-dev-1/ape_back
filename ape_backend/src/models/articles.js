import { Model, DataTypes } from 'sequelize';
import { sequelize } from './database.js';



export class Articles extends Model { }

Articles.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titre: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    contenu_bref: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    contenu: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    date_publication: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    auteur_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }

},
    {
        sequelize,
        tableName: "articles"
    });





