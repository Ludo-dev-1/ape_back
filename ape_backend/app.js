import express from 'express';
import sequelize, { connectToDatabase } from './src/models/database.js';
import cors from 'cors';
import { mainRouter } from './src/routers/mainRouter.js';
import { bureauRouter } from './src/routers/bureauRouter.js';
import { authenticate } from './src/authenticate/auth.js';
import authRouter from './src/routers/authRouter.js';
import adminRouter from './src/routers/adminRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration des fichiers statiques
app.use('/uploads', (req, res, next) => {
    console.log('Requête sur /uploads:', req.url);
    next();
});
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Middleware CORS
app.use(cors());

// Middleware
app.use(express.json());

// Connexion à la base
connectToDatabase();

// Liste des routes
app.use(mainRouter);
app.use('/bureau', bureauRouter);
app.use('/auth', authRouter);
app.use('/admin', authenticate, adminRouter);


app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
