import express from "express";
import { blogRouter } from "./blog-router.js";
import { clusterRouter } from "./cluster-router.js";

export const routerAPI = express.Router();

// Mount the routers.
routerAPI.use("/articles", blogRouter);

routerAPI.use("/clusters", clusterRouter);
