import dotenv from "dotenv"
dotenv.config();

export const development = {
    url: process.env.PG_URL,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
    },
};
