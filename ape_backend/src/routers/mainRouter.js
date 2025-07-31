import { Router } from "express";
import mainController from "../controllers/mainController.js";

const mainRouter = Router();

// Route pour récupérer tous les articles
mainRouter.get("/articles", mainController.getArticles);
mainRouter.get("/events", mainController.getEvents);

// Route pour récupérer un article par son ID
mainRouter.get("/article/:id", mainController.getArticle);
mainRouter.get("/event/:id", mainController.getEvent);

export { mainRouter };