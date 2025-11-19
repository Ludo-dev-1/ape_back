// src/migrations/seed-admin.js
import 'dotenv/config'; // charge automatiquement .env
import argon2 from 'argon2';
import { sequelize } from './src/models/database.js'; // ton instance Sequelize
import { Parents, Roles } from './src/models/index.js'; // tes modèles

(async () => {
    try {
        // Test de connexion à la DB
        await sequelize.authenticate();
        console.log('✅ Connexion à la base réussie !');

        // ⚡ On remplit d'abord la table Roles si vide
        const rolesData = [
            { id: 1, name: 'admin' },
            { id: 2, name: 'parents' },
            { id: 3, name: 'membreApe' },
            { id: 4, name: 'bureauApe' },
        ];

        for (const role of rolesData) {
            await Roles.findOrCreate({
                where: { id: role.id },
                defaults: role,
            });
        }
        console.log('✅ Table Roles remplie.');

        // Création d'un admin si pas déjà présent
        const hashedPassword = await argon2.hash('admin123');

        const [admin, created] = await Parents.findOrCreate({
            where: { email: 'admin@ape.fr' },
            defaults: {
                nom: 'Admin',
                prenom: 'Super',
                email: 'admin@ape.fr',
                password: hashedPassword,
                role_id: 1, // rôle admin
            },
        });

        console.log(created ? '✅ Admin créé !' : 'ℹ️ Admin déjà existant.');

        process.exit(0);
    } catch (err) {
        console.error('❌ Erreur lors du seed :', err);
        process.exit(1);
    }
})();
