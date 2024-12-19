import fs from "fs-extra";

export class BlogController {
  async getBlogTitles() {
    const blogTitles = [];

    const data = await fs.readFile("./data/articledata.txt", "utf8");
    const lines = data.split("\n");

    for (let i = 1; i < lines.length - 1; i++) {
      const name = lines[i].split("\t")[0];
      blogTitles.push(name);
    }

    return blogTitles; // 99
  }

  // Arrow function to bind this to the class instance
  getBlogTitlesJson = async (req, res, next) => {
    try {
      const blogTitles = await this.getBlogTitles();
      res.status(200).json(blogTitles);
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
    return keywords; // 706
  }

  async getWordCountsForBlog(blog) {
    const data = await fs.readFile("./data/articledata.txt", "utf8");
    const lines = data.split("\n");

    for (const line of lines.slice(1)) {
      const columns = line.split("\t");
      const blogName = columns[0];

      if (blogName === blog) {
        return columns.slice(1).map(Number);
      }
    }

    return blog; // If it's not found in the file, return the input (centroid case)
  }

  // Generate 706 randomly generated counts for each centroid ranging from min to max to that word
  async getKeywordOccurencesRange() {
    // Go through a line and find the minimum number of occurences for a word and return it
    const data = await fs.readFile("./data/articledata.txt", "utf8");
    const lines = data.split("\n");

    const keywordRanges = [];
    const numberOfKeywords = 706;
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
