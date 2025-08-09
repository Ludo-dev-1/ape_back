import { sequelize } from "../models/associations.js";

export const withTransaction = async (operation) => {
    const transaction = await sequelize.transaction();
    try {
        const result = await operation(transaction);
        await transaction.commit();
        return result;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};