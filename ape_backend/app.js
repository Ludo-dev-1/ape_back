import express from 'express';
import { sequelize, connectToDatabase } from './src/models/database.js';
import cors from 'cors';
import { mainRouter } from './src/routers/mainRouter.js';
import { bureauRouter } from './src/routers/bureauRouter.js';
import { authenticate } from './src/authenticate/auth.js';
import shopRouter from './src/routers/shopRoutes.js';
import authRouter from './src/routers/authRouter.js';
import adminRouter from './src/routers/adminRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import uploadRouter from './src/routers/uploadRouter.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware CORS
const allowedOrigins = [
    "http://localhost:5173",
    "https://ape-front-react.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("❌ CORS refusé pour :", origin);
            callback(new Error("CORS: origine non autorisée"));
        }
    },
    credentials: true,
}));


connectToDatabase().then(async () => {
    // Crée la table votes si elle n'existe pas
    await sequelize.sync({ force: false });
    console.log("✅ Tables synchronisées");

    app.listen(PORT, () => {
        console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
});

// Middleware
app.use(express.json());


// Liste des routes
app.use(mainRouter);
app.use('/api', uploadRouter);
app.use('/bureau', bureauRouter);
app.use('/auth', authRouter);
app.use('/admin', authenticate, adminRouter);
app.use('/shop', shopRouter);

// Connexion à la base
connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
});
