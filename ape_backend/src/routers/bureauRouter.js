import multer from 'multer';
import { Router } from 'express';
import path, { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bureauController from '../controllers/bureauController.js';

// ➤ Définition de __dirname compatible ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ➤ Configuration de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, join(__dirname, '..', '..', 'uploads'));

    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

const bureauRouter = Router();

// ➤ Routes pour les articles
bureauRouter.post('/articles', upload.single('image'), bureauController.createArticle);
bureauRouter.delete('/articles/:id', bureauController.deleteArticle);
bureauRouter.put('/articles/:id', upload.single('image'), bureauController.updateArticle);

// ➤ Routes pour les événements
bureauRouter.post('/events', upload.single('image'), bureauController.createEvent);
/* bureauRouter.delete('/events/:id', bureauController.deleteEvent);
bureauRouter.put('/events/:id', upload.single('image'), bureauController.updateEvent); */

export { bureauRouter };
