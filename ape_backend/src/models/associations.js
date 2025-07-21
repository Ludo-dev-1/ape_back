import sequelize from '../../src/models/database.js';
import { Roles } from './roles.js';
import { Parents } from './parents.js';
import { Evenements } from './evenements.js';
import { Articles } from './articles.js';

// Associations belongs to
Parents.belongsTo(Roles, { foreignKey: 'role_id', as: 'role' });
Articles.belongsTo(Parents, { foreignKey: 'auteur_id', as: 'auteur' });
Evenements.belongsTo(Parents, { foreignKey: 'auteur_id', as: 'auteur' });

// Associations has many
Parents.hasMany(Articles, { foreignKey: 'auteur_id', as: 'articles' });
Parents.hasMany(Evenements, { foreignKey: 'auteur_id', as: 'evenements' });


export { Parents, Roles, Evenements, Articles, sequelize };