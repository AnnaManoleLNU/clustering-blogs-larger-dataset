import express from "express";
import { ArticleController } from "../../controllers/article-controller.js";

export const articleRouter = express.Router();

const controller = new ArticleController();

articleRouter.get("/", controller.getArticleTitlesJson);