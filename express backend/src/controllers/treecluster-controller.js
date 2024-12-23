import { ArticleController } from "./article-controller.js";

export class TreeClusterController {
  #numberOfWords = 0;

  constructor() {
    this.clusters = [];
    this.articleController = new ArticleController();
  }

  // Dynamically set the file path and initialize number of words
  async setFileAndInitialize(useSelectedWords = false) {
    this.articleController.setFilePath(useSelectedWords);
    const keywords = await this.articleController.getKeywords();
    this.#numberOfWords = keywords.length;
    console.log(
      `File set to: ${
        useSelectedWords ? "selectedWords_data.txt" : "words_data.txt"
      }, Number of words: ${this.#numberOfWords}`
    );
  }

  // Generate initial clusters from article titles
  async generateClusters() {
    this.clusters = [];
    const articleTitles = await this.articleController.getArticleTitles();

    for (const articleTitle of articleTitles) {
      const wordCounts = await this.articleController.getWordCountsForArticle(
        articleTitle
      );

      // Create a cluster for each article
      const cluster = {
        article: { articleTitle: articleTitle, wordCount: wordCounts },
        left: null,
        right: null,
        parent: null,
        distance: 0,
      };

      this.clusters.push(cluster);
    }
  }

  async pearsons(wordCountsA, wordCountsB) {
    let sumA = 0,
      sumB = 0,
      sumAsq = 0,
      sumBsq = 0,
      pSum = 0;

    for (let i = 0; i < this.#numberOfWords; i++) {
      const wordCountA = wordCountsA[i];
      const wordCountB = wordCountsB[i];
      sumA += wordCountA;
      sumB += wordCountB;
      sumAsq += wordCountA ** 2;
      sumBsq += wordCountB ** 2;
      pSum += wordCountA * wordCountB;
    }

    const numerator = pSum - (sumA * sumB) / this.#numberOfWords;
    const denominator = Math.sqrt(
      (sumAsq - sumA ** 2 / this.#numberOfWords) *
        (sumBsq - sumB ** 2 / this.#numberOfWords)
    );

    return 1 - numerator / denominator;
  }

  merge(clusterA, clusterB) {
    const newCluster = {
      left: clusterA,
      right: clusterB,
    };

    // Set parents of the clusters
    clusterA.parent = newCluster;
    clusterB.parent = newCluster;

    const newarticle = {
      wordCount: [],
    };

    // Calculate the average word count for the new merged article
    for (let i = 0; i < this.#numberOfWords; i++) {
      const countA = clusterA.article ? clusterA.article.wordCount[i] : 0;
      const countB = clusterB.article ? clusterB.article.wordCount[i] : 0;

      newarticle.wordCount[i] = (countA + countB) / 2;
    }

    newCluster.article = newarticle;

    return newCluster;
  }

  async generateHierarchy() {
    this.clusters = [];
    await this.generateClusters();

    while (this.clusters.length > 1) {
      let closest = Infinity;
      let A = null;
      let B = null;

      // Find the two closest clusters based on Pearson distance
      for (let i = 0; i < this.clusters.length; i++) {
        for (let j = i + 1; j < this.clusters.length; j++) {
          const distance = await this.pearsons(
            this.clusters[i].article.wordCount,
            this.clusters[j].article.wordCount
          );
          if (distance < closest) {
            closest = distance;
            A = this.clusters[i];
            B = this.clusters[j];
          }
        }
      }

      // Merge the two closest clusters
      const newCluster = this.merge(A, B, closest);

      // Add the new cluster to the list and remove the old ones
      this.clusters.push(newCluster);
      this.clusters = this.clusters.filter(
        (cluster) => cluster !== A && cluster !== B
      );
    }
  }

  // Serialize a single cluster to avoid circular references
  serializeTree(cluster, depth = 0) {
    if (!cluster) return null;
  
    const title = cluster.article?.articleTitle || "Cluster";
  
    // Add depth for simpler rendering
    return {
      title,
      depth,
      children: [
        this.serializeTree(cluster.left, depth + 1),
        this.serializeTree(cluster.right, depth + 1),
      ].filter(Boolean), // Remove null children
    };
  }

  getHierarchicalClustering = async (req, res, next) => {
    try {
      await this.generateHierarchy();

      const tree = this.serializeTree(this.clusters[0]);
      res.status(200).json(tree);
    } catch (error) {
      next(error);
    }
  };
}
