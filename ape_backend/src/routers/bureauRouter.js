import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import bureauController from '../controllers/bureauController.js';
import { uploadBufferToSupabase } from '../../supabaseClient.js';

const bureauRouter = Router();

// Multer en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ➤ Routes pour les articles
bureauRouter.post('/articles', upload.single('image'), async (req, res, next) => {
    try {
        if (req.file) {
            const publicUrl = await uploadBufferToSupabase(
                req.file.buffer,
                Date.now() + path.extname(req.file.originalname)
            );
            req.body.imageUrl = publicUrl;
        }
        await bureauController.createArticle(req, res);
    } catch (err) {
        next(err);
    }
});

bureauRouter.put('/articles/:id', upload.single('image'), async (req, res, next) => {
    try {
        if (req.file) {
            const publicUrl = await uploadBufferToSupabase(
                req.file.buffer,
                Date.now() + path.extname(req.file.originalname)
            );
            req.body.imageUrl = publicUrl;
        }
        await bureauController.updateArticle(req, res);
    } catch (err) {
        next(err);
    }
});

bureauRouter.delete('/articles/:id', bureauController.deleteArticle);

// ➤ Routes pour les événements
bureauRouter.post('/events', upload.single('image'), async (req, res, next) => {
    try {
        if (req.file) {
            const publicUrl = await uploadBufferToSupabase(
                req.file.buffer,
                Date.now() + path.extname(req.file.originalname)
            );
            req.body.imageUrl = publicUrl;
        }
        await bureauController.createEvent(req, res);
    } catch (err) {
        next(err);
    }
});

bureauRouter.put('/events/:id', upload.single('image'), async (req, res, next) => {
    try {
        if (req.file) {
            const publicUrl = await uploadBufferToSupabase(
                req.file.buffer,
                Date.now() + path.extname(req.file.originalname)
            );
            req.body.imageUrl = publicUrl;
        }
        await bureauController.updateEvent(req, res);
    } catch (err) {
        next(err);
    }
});

bureauRouter.delete('/events/:id', bureauController.deleteEvent);

export { bureauRouter };
