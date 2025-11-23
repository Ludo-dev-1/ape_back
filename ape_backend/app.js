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
    "http://localhost:4200",
    "https://ape-frontend.onrender.com",
    "https://ape-frontend-xxxxx.onrender.com"
];

app.use(cors({
    origin: function (origin, callback) {
        // autorise les requêtes sans origin (ex: postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            console.error("❌ CORS refusé pour :", origin);
            return callback(new Error("CORS: origine non autorisée"));
        }
    },
    credentials: true
}));


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
