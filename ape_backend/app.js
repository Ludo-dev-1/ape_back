import express from 'express';
import { sequelize, connectToDatabase } from './src/models/database.js';
import cors from 'cors';
import { mainRouter } from './src/routers/mainRouter.js';
import { bureauRouter } from './src/routers/bureauRouter.js';
import { authenticate } from './src/authenticate/auth.js';
import shopRouter from './src/routers/shopRoutes.js';
import authRouter from './src/routers/authRouter.js';
import adminRouter from './src/routers/adminRouter.js';
import uploadRouter from './src/routers/uploadRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
const allowedOrigins = [
    "http://localhost:5173",
    "https://ape-front-react.vercel.app"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS: origine non autorisée"));
        }
    },
    credentials: true,
}));

app.use(express.json());

// Routes
app.use(mainRouter);
app.use('/api', uploadRouter);
app.use('/bureau', bureauRouter);
app.use('/auth', authRouter);
app.use('/admin', authenticate, adminRouter);
app.use('/shop', shopRouter);

// 🚀 Connexion + Sync + Start (UNE SEULE FOIS)
connectToDatabase().then(async () => {
    await sequelize.sync({ alter: true });
    console.log("Tables synchronisées");

    app.listen(PORT, () => {
        console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
});
