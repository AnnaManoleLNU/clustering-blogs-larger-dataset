import fs from "fs-extra";

export class ArticleController {
  constructor() {
    // Default file path (can be switched dynamically)
    this.defaultFilePath = "./data/words_data.txt";
  }

  // Set the file path based on word set
  setFilePath(useSelectedWords = false) {
    this.defaultFilePath = useSelectedWords
      ? "./data/selectedWords_data.txt"
      : "./data/words_data.txt";
  }

  async getArticleTitles() {
    const articleTitles = [];
    const data = await fs.readFile(this.defaultFilePath, "utf8");
    const lines = data.split("\n");

    for (let i = 1; i < lines.length - 1; i++) {
      const name = lines[i].split("\t")[0];
      articleTitles.push(name);
    }
    return articleTitles;
  }

  // Arrow function to bind this to the class instance
  getArticleTitlesJson = async (req, res, next) => {
    try {
      const articleTitles = await this.getArticleTitles();
      res.status(200).json(articleTitles);
    } catch (error) {
      next(error);
    }
  };

  async getKeywords() {
    const keywords = [];

    const data = await fs.readFile(this.defaultFilePath, "utf8");
    const firstLine = data.split("\n")[0];

    const words = firstLine.split("\t");
    for (let i = 1; i < words.length; i++) {
      keywords.push(words[i]);
    }
    return keywords;
  }

  async getWordCountsForArticle(article) {
    const data = await fs.readFile(this.defaultFilePath, "utf8");
    const lines = data.split("\n");

    for (const line of lines.slice(1)) {
      const columns = line.split("\t");
      const articleName = columns[0];

      if (articleName === article) {
        return columns.slice(1).map(Number);
      }
    }

    return article; // If it's not found in the file, return the input (centroid case)
  }

  // Randomly generated counts for each centroid ranging from min to max to that word
  async getKeywordOccurencesRange() {
    const data = await fs.readFile(this.defaultFilePath, "utf8");
    const lines = data.split("\n");

    const keywordRanges = [];
    const numberOfKeywords = lines[0].split("\t").length - 1; // Adjust based on header

    for (let i = 0; i < numberOfKeywords; i++) {
      keywordRanges.push({ min: Infinity, max: -Infinity });
    }

    for (const line of lines.slice(1)) {
      const columns = line.split("\t");
      for (let i = 1; i < columns.length; i++) {
        const count = parseInt(columns[i], 10);
        keywordRanges[i - 1].min = Math.min(keywordRanges[i - 1].min, count);
        keywordRanges[i - 1].max = Math.max(keywordRanges[i - 1].max, count);
      }
    }

    return keywordRanges;
  }
}
