import express from "express";
import { ClusterController } from "../../controllers/cluster-controller.js";
import { TreeClusterController } from "../../controllers/treecluster-controller.js";
import { ArticleDataFormatter } from "../../controllers/articledata-formatter.js";

export const clusterRouter = express.Router();

// Controllers
const kController = new ClusterController();
const treeClusterController = new TreeClusterController();
const adf = new ArticleDataFormatter();

// Generate selected words and process files
(async () => {
  try {
    await adf.generateSelectedWords();
    await adf.processFiles(adf.words); // Process files for words_data.txt
    await adf.processFiles(adf.selectedWords, true); // Process files for selectedWords_data.txt
  } catch (error) {
    console.error("Error during file processing:", error);
  }
})();

// Middleware to dynamically select file and initialize controller
const setFileMiddleware = (controller, useSelectedWords) => async (req, res, next) => {
  try {
    await controller.setFileAndInitialize(useSelectedWords);
    next();
  } catch (error) {
    console.error("Error during file initialization:", error);
    res.status(500).send("Failed to initialize clustering");
  }
};

// Routes
clusterRouter.get(
  "/kfixed",
  setFileMiddleware(kController, false), // Use words_data.txt
  kController.getClustersFixedIterations
);

clusterRouter.get(
  "/kflexible",
  setFileMiddleware(kController, false), // Use words_data.txt
  kController.getClustersFlexibleIterations
);

clusterRouter.get(
  "/hierarchical",
  setFileMiddleware(treeClusterController, false), // Use words_data.txt
  treeClusterController.getHierarchicalClustering
);

clusterRouter.get(
  "/kfixed-selected",
  setFileMiddleware(kController, true), // Use selectedWords_data.txt
  kController.getClustersFixedIterations
);

clusterRouter.get(
  "/kflexible-selected",
  setFileMiddleware(kController, true), // Use selectedWords_data.txt
  kController.getClustersFlexibleIterations
);

clusterRouter.get(
  "/hierarchical-selected",
  setFileMiddleware(treeClusterController, true), // Use selectedWords_data.txt
  treeClusterController.getHierarchicalClustering
);
