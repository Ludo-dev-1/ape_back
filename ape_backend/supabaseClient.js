import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import mime from "mime-types";
import dotenv from "dotenv";

dotenv.config();

// Client Supabase sécurisé (SERVER SIDE)
export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // IMPORTANT : rôle serveur seulement côté backend
);

/**
 * Upload depuis un fichier local (optionnel)
 */
export const uploadFileToSupabase = async (filePath, fileName, bucket = "uploads") => {
    const fileData = fs.readFileSync(filePath);

    const contentType = mime.lookup(fileName) || "application/octet-stream";

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, fileData, {
            cacheControl: "3600",
            upsert: true,
            contentType,
        });

    if (error) throw error;

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return publicData.publicUrl;
};

/**
 * Upload depuis un buffer — version principale utilisée pour Multer
 */
export const uploadBufferToSupabase = async (buffer, fileName, bucket = "uploads") => {
    const contentType = mime.lookup(fileName) || "application/octet-stream";

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, buffer, {
            cacheControl: "3600",
            upsert: true,
            contentType, // ✔ corrige totalement le problème d'ouverture des PDF
        });

    if (error) {
        console.error("Erreur d'upload sur Supabase :", error);
        throw error;
    }

    // Récupération URL publique finale
    const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return publicData.publicUrl;
};
