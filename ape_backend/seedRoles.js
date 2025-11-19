import { Roles } from "./src/models/index.js";
import { sequelize } from "./src/models/database.js";

await sequelize.authenticate();
console.log("Connecté à la base.");

await Roles.bulkCreate([
    { id: 1, nom: "admin" },
    { id: 2, nom: "parents" },
    { id: 3, nom: "membreApe" },
    { id: 4, nom: "bureauApe" }
]);

console.log("Rôles insérés !");
process.exit();
