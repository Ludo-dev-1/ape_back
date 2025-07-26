import multer from 'multer';
import { Router } from 'express';
import path from 'path';
import bureauController from '../controllers/bureauController.js';

// Configuration de multer
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // nom unique
    },
});
const upload = multer({ storage });



const bureauRouter = Router();

bureauRouter.post('/articles', upload.single('image'), bureauController.createArticle);
bureauRouter.delete('/articles/:id', bureauController.deleteArticle);

export { bureauRouter };