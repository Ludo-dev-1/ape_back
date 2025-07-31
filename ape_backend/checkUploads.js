import fs from 'fs';
import path from 'path';

const uploadsPath = path.join(process.cwd(), 'uploads');
console.log('Dossier /uploads attendu ici :', uploadsPath);

fs.readdir(uploadsPath, (err, files) => {
    if (err) {
        console.error('Erreur : impossible de lire le dossier uploads', err);
        return;
    }
    console.log('Fichiers trouvés dans /uploads :', files);
});
