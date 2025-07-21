import express from 'express';
import sequelize, { connectToDatabase } from './src/models/database.js';
import cors from 'cors';
import { mainRouter } from './src/routers/mainRouter.js';
import { bureauRouter } from './src/routers/bureauRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS
app.use(cors());

// Middleware
app.use(express.json());

// Configuration des fichiers statiques
app.use("/uploads", express.static("public/uploads"));

// Liste des routes
app.use(mainRouter);
app.use('/bureau', bureauRouter);

// Connexion à la base
connectToDatabase();

app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
