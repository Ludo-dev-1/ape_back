import { Roles, Parents, Articles, Evenements, sequelize } from '../models/associations.js';
import bcrypt from 'bcrypt';

const seed = async () => {
    try {
        await sequelize.sync({ force: true }); // ⚠️ Réinitialise la base (supprime tout)
        console.log("🔄 Base de données synchronisée");

        // Création des rôles
        const roles = await Roles.bulkCreate([
            { nom: 'parent' },
            { nom: 'membre_ape' }
        ]);
        console.log("✅ Rôles insérés");

        // Création des parents
        const parents = await Parents.bulkCreate([
            {
                nom: 'Dupont',
                prenom: 'Marie',
                email: 'marie@parent.fr',
                mot_de_passe: await bcrypt.hash('password123', 10),
                role_id: roles.find(r => r.nom === 'parent').id
            },
            {
                nom: 'Martin',
                prenom: 'Jean',
                email: 'jean@ape.fr',
                mot_de_passe: await bcrypt.hash('ape123', 10),
                role_id: roles.find(r => r.nom === 'membre_ape').id
            }
        ]);
        console.log("✅ Parents insérés");

        // Création d’un article par un membre APE
        await Articles.create({
            titre: "Assemblée générale",
            contenu: "Rendez-vous le 10 septembre pour l'AG de rentrée.",
            auteur_id: parents.find(p => p.email === 'jean@ape.fr').id
        });
        console.log("📝 Article créé");

        // Création d’un événement par un membre APE
        await Evenements.create({
            titre: "Fête de l'école",
            description: "Grande fête avec jeux, stands et buvette.",
            date_event: new Date('2025-06-15'),
            auteur_id: parents.find(p => p.email === 'jean@ape.fr').id
        });
        console.log("📅 Événement créé");

        console.log("🌱 Seed terminé avec succès !");
        process.exit(0);

    } catch (error) {
        console.error("❌ Erreur lors du seed :", error);
        process.exit(1);
    }
};

seed();
