import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Uploader depuis un chemin local (optionnel, tu peux garder pour migration)
export const uploadFileToSupabase = async (filePath, fileName, bucket = 'uploads') => {
    const fileData = fs.readFileSync(filePath);
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, fileData, {
        cacheControl: '3600',
        upsert: true,
    });
    if (error) throw error;
    return data.path;
};

export const uploadBufferToSupabase = async (buffer, fileName, bucket = 'uploads') => {
    // Upload du fichier
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, buffer, {
            cacheControl: '3600',
            upsert: true,
        });

    if (error) throw error;

    // Récupération URL publique (CORRECTION ICI)
    const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return publicData.publicUrl; // ✔️ URL correcte
};

