import express from "express";
import { articleRouter } from "./article-router.js";
import { clusterRouter } from "./cluster-router.js";

export const routerAPI = express.Router();

// Mount the routers.
routerAPI.use("/articles", articleRouter);

routerAPI.use("/clusters", clusterRouter);
