import express from 'express';
import { supabase } from '../../supabaseClient.js';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: '/tmp' }); // Compatible Render

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const originalName = req.file.originalname;

        // éviter les collisions
        const fileName = `${Date.now()}-${originalName}`;

        const fileBuffer = fs.readFileSync(filePath);

        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(fileName, fileBuffer, {
                cacheControl: '3600',
                upsert: true,
                contentType: req.file.mimetype
            });

        fs.unlinkSync(filePath); // supprime le fichier temporaire

        if (error) return res.status(500).json({ error });
        res.json({ message: 'Fichier uploadé', path: data.path });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;
