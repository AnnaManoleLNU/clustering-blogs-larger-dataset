import express from "express";
import { ArticleController } from "../../controllers/article-controller.js";

export const blogRouter = express.Router();

const controller = new ArticleController();

blogRouter.get("/", controller.getArticleTitlesJson);