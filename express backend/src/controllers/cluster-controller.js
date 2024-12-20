import { ArticleController } from "./article-controller.js";

export class ClusterController {
  constructor() {
    this.articleController = new ArticleController();
    this.numberOfWords = 20;
  }

  async pearsons(wordCountsA, wordCountsB) {
    let sumA = 0,
      sumB = 0,
      sumAsq = 0,
      sumBsq = 0,
      pSum = 0;

    for (let i = 0; i < this.numberOfWords; i++) {
      const wordCountA = wordCountsA[i];
      const wordCountB = wordCountsB[i];
      sumA += wordCountA;
      sumB += wordCountB;
      sumAsq += wordCountA ** 2;
      sumBsq += wordCountB ** 2;
      pSum += wordCountA * wordCountB;
    }

    const numerator = pSum - (sumA * sumB) / this.numberOfWords;
    const denominator = Math.sqrt(
      (sumAsq - sumA ** 2 / this.numberOfWords) *
        (sumBsq - sumB ** 2 / this.numberOfWords)
    );

    if (denominator === 0) return 1; // Maximum distance if denominator is zero
    return 1 - numerator / denominator;
  }

  async fetchAllWordCounts(articles) {
    const wordCountsPromises = [];
    for (let i = 0; i < articles.length; i++) {
      wordCountsPromises.push(
        this.articleController.getWordCountsForArticle(articles[i])
      );
    }
    const wordCountsArray = await Promise.all(wordCountsPromises);

    const wordCountsCache = {};
    for (let i = 0; i < articles.length; i++) {
      wordCountsCache[articles[i]] = wordCountsArray[i];
    }

    return wordCountsCache;
  }

  generateCentroid(keywordRanges) {
    const centroid = [];
    for (let i = 0; i < this.numberOfWords; i++) {
      const min = keywordRanges[i].min;
      const max = keywordRanges[i].max;
      centroid.push(Math.floor(Math.random() * (max - min) + min));
    }

    return centroid;
  }

  generateCentroids(keywordRanges, k) {
    const centroids = [];
    for (let i = 0; i < k; i++) {
      const centroid = this.generateCentroid(keywordRanges);
      centroids.push({
        id: `Cluster ${i + 1}`,
        wordCounts: centroid,
        assignments: [],
      });
    }

    return centroids;
  }

  async assignArticleToCentroid(articleWordCounts, centroids) {
    let bestCentroid = null;
    let minDistance = Infinity;
  
    for (let i = 0; i < centroids.length; i++) {
      if (!centroids[i].wordCounts) {
        console.warn(`Centroid ${centroids[i].id} has no wordCounts`);
        continue;
      }
      
      const distance = await this.pearsons(articleWordCounts, centroids[i].wordCounts);
      if (distance < minDistance) {
        minDistance = distance;
        bestCentroid = centroids[i];
      }
    }
  
    return bestCentroid;
  }

  async kMeansClusteringFixedIterations(k) {
    const articles = await this.articleController.getArticleTitles();
    const keywordRanges = await this.articleController.getKeywordOccurencesRange();
    const allWordCounts = await this.fetchAllWordCounts(articles);

    let centroids = this.generateCentroids(keywordRanges, k);
    const maxIterations = 10;

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      for (let i = 0; i < centroids.length; i++) {
        centroids[i].assignments = [];
      }

      // Assign to article
      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        const articleWordCounts = allWordCounts[article];
        const bestCentroid = await this.assignArticleToCentroid(
          articleWordCounts,
          centroids
        );
        bestCentroid.assignments.push(article);
      }

      // Recalculate centroids
      for (let i = 0; i < centroids.length; i++) {
        const centroid = centroids[i];
        for (let j = 0; j < this.numberOfWords; j++) {
          let sum = 0;
          for (let k = 0; k < centroid.assignments.length; k++) {
            const article = centroid.assignments[k];
            sum += allWordCounts[article][j];
          }
          centroid.wordCounts[j] = Math.floor(
            sum / centroid.assignments.length
          );
        }
      }
    }

    const result = {};
    for (let i = 0; i < centroids.length; i++) {
      const centroid = centroids[i];
      result[centroid.id] = centroid.assignments;
    }

    return result;
  }

  async kMeansClusteringFlexibleIterations(k) {
    const articles = await this.articleController.getArticleTitles();
    const keywordRanges = await this.articleController.getKeywordOccurencesRange();
    const allWordCounts = await this.fetchAllWordCounts(articles);

    let centroids = this.generateCentroids(keywordRanges, k);
    let hasAssignmentChanged = true;
    let numberOfIterations = 0

    while (hasAssignmentChanged) {
      hasAssignmentChanged = false;
      numberOfIterations++

      for (let i = 0; i < centroids.length; i++) {
        centroids[i].previousAssignments = [...centroids[i].assignments];
        centroids[i].assignments = [];
      }

      // Assign article to centroids
      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        const articleWordCounts = allWordCounts[article];
        const bestCentroid = await this.assignArticleToCentroid(
          articleWordCounts,
          centroids
        );
        bestCentroid.assignments.push(article);
      }

      // Check if assignments changed
      for (let i = 0; i < centroids.length; i++) {
        const previousAssignments = centroids[i].previousAssignments;
        const currentAssignments = centroids[i].assignments;

        if (
          previousAssignments.length !== currentAssignments.length ||
          !previousAssignments.every(
            (value, index) => value === currentAssignments[index]
          )
        ) {
          hasAssignmentChanged = true;
        }
      }

      // Recalculate centroids based on new assignments 
      for (let i = 0; i < centroids.length; i++) {
        const centroid = centroids[i];

        for (let j = 0; j < 760; j++) {
          let sum = 0;
          for (let k = 0; k < centroid.assignments.length; k++) {
            const article = centroid.assignments[k];
            sum += allWordCounts[article][j]; // sum of all word counts for a keyword
          }
          centroid.wordCounts[j] = Math.floor(sum / centroid.assignments.length)
        }
      }
    }

    const result = {};
    for (let i = 0; i < centroids.length; i++) {
      const centroid = centroids[i];
      result[centroid.id] = centroid.assignments;
    }

    console.log("The number of iterations until no new assignments", numberOfIterations)

    return result;
  }

  getClustersFixedIterations = async (req, res, next) => {
    try {
      const clusters = await this.kMeansClusteringFixedIterations(2);
      res.status(200).json(clusters);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getClustersFlexibleIterations = async(req, res, next) => {
    try {
      const clusters = await this.kMeansClusteringFlexibleIterations(2);
      res.status(200).json(clusters);
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}
