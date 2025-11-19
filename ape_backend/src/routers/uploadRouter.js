import express from 'express';
import { supabase } from '../supabaseClient.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const upload = multer({ dest: 'tmp/' }); // dossier temporaire

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const fileName = req.file.originalname;

        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(fileName, fs.readFileSync(filePath), {
                cacheControl: '3600',
                upsert: true
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
