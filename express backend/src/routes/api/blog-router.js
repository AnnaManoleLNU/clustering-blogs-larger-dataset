import express from "express";
import { BlogController } from "../../controllers/blog-controller.js";

export const blogRouter = express.Router();

const controller = new BlogController();

blogRouter.get("/", controller.getBlogTitlesJson)