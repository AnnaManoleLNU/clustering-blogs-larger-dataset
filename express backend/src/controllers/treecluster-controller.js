import { BlogController } from "./blog-controller.js";

export class TreeClusterController {
  #numberOfWords = 20;

  constructor() {
    this.clusters = [];
    this.blogController = new BlogController();
  }

  // Generate initial clusters from blog titles
  async generateClusters() {
    const blogTitles = await this.blogController.getBlogTitles();

    for (const blogTitle of blogTitles) {
      const wordCounts = await this.blogController.getWordCountsForBlog(
        blogTitle
      );

      // Create a cluster for each blog
      const cluster = {
        blog: { blogTitle: blogTitle, wordCount: wordCounts },
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

    const newBlog = {
      wordCount: [],
    };

    // Calculate the average word count for the new merged blog
    for (let i = 0; i < this.#numberOfWords; i++) {
      const countA = clusterA.blog ? clusterA.blog.wordCount[i] : 0;
      const countB = clusterB.blog ? clusterB.blog.wordCount[i] : 0;

      newBlog.wordCount[i] = (countA + countB) / 2;
    }

    newCluster.blog = newBlog;

    return newCluster;
  }

  async generateHierarchy() {
    if (this.clusters.length === 0) {
      await this.generateClusters();
    }

    while (this.clusters.length > 1) {
      let closest = Infinity;
      let A = null;
      let B = null;

      // Find the two closest clusters based on Pearson distance
      for (let i = 0; i < this.clusters.length; i++) {
        for (let j = i + 1; j < this.clusters.length; j++) {
          const distance = await this.pearsons(
            this.clusters[i].blog.wordCount,
            this.clusters[j].blog.wordCount
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
  serializeTree(cluster) {
    if (!cluster) return null;

    const title = cluster.blog.blogTitle || null;

    return {
      title: title,
      children: [
        this.serializeTree(cluster.left),
        this.serializeTree(cluster.right),
      ].filter((child) => child !== null),
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
