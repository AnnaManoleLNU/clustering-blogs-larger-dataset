import fs from "fs-extra";

export class ArticleController {
  async getArticleTitles() {
    const articleTitles = [];

    const data = await fs.readFile("./data/articledata.txt", "utf8");
    const lines = data.split("\n");

    for (let i = 1; i < lines.length - 1; i++) {
      const name = lines[i].split("\t")[0];
      articleTitles.push(name);
    }

    console.log(articleTitles.length);
    return articleTitles; // 180
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

    const data = await fs.readFile("./data/articledata.txt", "utf8");
    const firstLine = data.split("\n")[0];

    const words = firstLine.split("\t");
    for (let i = 1; i < words.length; i++) {
      keywords.push(words[i]);
    }

    console.log(keywords.length);
    return keywords; // 19
  }

  async getWordCountsForArticle(article) {
    const data = await fs.readFile("./data/articledata.txt", "utf8");
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
    // Go through a line and find the minimum number of occurences for a word and return it
    const data = await fs.readFile("./data/articledata.txt", "utf8");
    const lines = data.split("\n");

    const keywordRanges = [];
    const numberOfKeywords = 20;
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
