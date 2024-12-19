import express from "express";
import { ClusterController } from "../../controllers/cluster-controller.js";
import { TreeClusterController } from "../../controllers/treecluster-controller.js";

export const clusterRouter = express.Router();

const kController = new ClusterController();
const treeClusterController = new TreeClusterController();

clusterRouter.get("/kfixed", kController.getClustersFixedIterations)

clusterRouter.get("/kflexible", kController.getClustersFlexibleIterations)

clusterRouter.get("/hierarchical", treeClusterController.getHierarchicalClustering)