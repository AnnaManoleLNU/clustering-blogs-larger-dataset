import { BlogController } from "./blog-controller.js";

export class ClusterController {
  constructor() {
    this.blogController = new BlogController();
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

  async fetchAllWordCounts(blogs) {
    const wordCountsPromises = [];
    for (let i = 0; i < blogs.length; i++) {
      wordCountsPromises.push(
        this.blogController.getWordCountsForBlog(blogs[i])
      );
    }
    const wordCountsArray = await Promise.all(wordCountsPromises);

    const wordCountsCache = {};
    for (let i = 0; i < blogs.length; i++) {
      wordCountsCache[blogs[i]] = wordCountsArray[i];
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

  async assignBlogToCentroid(blogWordCounts, centroids) {
    let bestCentroid = null;
    let minDistance = Infinity;
  
    for (let i = 0; i < centroids.length; i++) {
      if (!centroids[i].wordCounts) {
        console.warn(`Centroid ${centroids[i].id} has no wordCounts`);
        continue;
      }
      
      const distance = await this.pearsons(blogWordCounts, centroids[i].wordCounts);
      if (distance < minDistance) {
        minDistance = distance;
        bestCentroid = centroids[i];
      }
    }
  
    if (!bestCentroid) {
      throw new Error('No suitable centroid found for blog');
    }
  
    return bestCentroid;
  }

  async kMeansClusteringFixedIterations(k) {
    const blogs = await this.blogController.getBlogTitles();
    const keywordRanges = await this.blogController.getKeywordOccurencesRange();
    const allWordCounts = await this.fetchAllWordCounts(blogs);

    let centroids = this.generateCentroids(keywordRanges, k);
    const maxIterations = 10;

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      for (let i = 0; i < centroids.length; i++) {
        centroids[i].assignments = [];
      }

      // Assign to blog
      for (let i = 0; i < blogs.length; i++) {
        const blog = blogs[i];
        const blogWordCounts = allWordCounts[blog];
        const bestCentroid = await this.assignBlogToCentroid(
          blogWordCounts,
          centroids
        );
        bestCentroid.assignments.push(blog);
      }

      // Recalculate centroids
      for (let i = 0; i < centroids.length; i++) {
        const centroid = centroids[i];
        for (let j = 0; j < this.numberOfWords; j++) {
          let sum = 0;
          for (let k = 0; k < centroid.assignments.length; k++) {
            const blog = centroid.assignments[k];
            sum += allWordCounts[blog][j];
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
    const blogs = await this.blogController.getBlogTitles();
    const keywordRanges = await this.blogController.getKeywordOccurencesRange();
    const allWordCounts = await this.fetchAllWordCounts(blogs);

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

      // Assign blog to centroids
      for (let i = 0; i < blogs.length; i++) {
        const blog = blogs[i];
        const blogWordCounts = allWordCounts[blog];
        const bestCentroid = await this.assignBlogToCentroid(
          blogWordCounts,
          centroids
        );
        bestCentroid.assignments.push(blog);
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
            const blog = centroid.assignments[k];
            sum += allWordCounts[blog][j]; // sum of all word counts for a keyword
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
