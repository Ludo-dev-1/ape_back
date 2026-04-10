'use strict';

export async function up(queryInterface, Sequelize) {
    // Vérifier si les colonnes existent déjà
    const columns = await queryInterface.describeTable('votes');

    // Ajouter la colonne 'title' si elle n'existe pas
    if (!columns.title) {
        await queryInterface.addColumn('votes', 'title', {
            type: Sequelize.STRING(255),
            allowNull: false,
            defaultValue: 'Sondage sans titre',
        });
    }

    // Ajouter la colonne 'count' si elle n'existe pas
    if (!columns.count) {
        await queryInterface.addColumn('votes', 'count', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        });
    }
}

export async function down(queryInterface, Sequelize) {
    const columns = await queryInterface.describeTable('votes');

    // Supprimer les colonnes ajoutées
    if (columns.title) {
        await queryInterface.removeColumn('votes', 'title');
    }

    if (columns.count) {
        await queryInterface.removeColumn('votes', 'count');
    }
}
