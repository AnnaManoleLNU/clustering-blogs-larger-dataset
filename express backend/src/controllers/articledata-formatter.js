import fs from "fs-extra";

export class ArticleDataFormatter {
  constructor() {
    this.words = ["language", "programming", "computer", "software", "hardware", "data", "player", "online", "system", "development", "machine", "console", "developer", "design", "history", "technology", "standard", "information", "article", "example"];
  }

  getNumberOfWords() {
    return this.words.length;
  }

  generateHeader() {
    return "Article\t" + this.words.join("\t");
  }

  async getWordOccurences(folder, file) {
    const data = await fs.readFile(`${folder}/${file}`, "utf8");
    const words = data.split(" ");
    return this.words.map(word => words.filter(w => w === word).length);
  }

  async processFiles() {
    const header = this.generateHeader();
    await fs.writeFile("./data/articledata.txt", header + "\n");
    
    const gamesFolder = "./data/Wikipedia_clustering/Games";
    for (const file of await fs.readdir(gamesFolder)) {
      const row = []
      row.push(file);
      const occurences = await this.getWordOccurences(gamesFolder, file);
      row.push(...occurences);
      await fs.appendFile("./data/articledata.txt", row.join("\t") + "\n");
    }
    
    const programmingFolder = "./data/Wikipedia_clustering/Programming";
    for (const file of await fs.readdir(programmingFolder)) {
      const row = []
      row.push(file);
      const occurences = await this.getWordOccurences(programmingFolder, file);
      row.push(...occurences);
      await fs.appendFile("./data/articledata.txt", row.join("\t") + "\n");
    }
  }
}