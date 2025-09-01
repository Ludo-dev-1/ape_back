import argon2 from "argon2";

const hashPassword = async () => {
    const hash = await argon2.hash("admin123"); // mot de passe en clair
    console.log(hash); // copie le hash pour pgAdmin
};

hashPassword();
