import fs from "fs-extra";

export class ArticleDataFormatter {
  constructor() {
    this.words = ["language", "programming", "computer", "software", "hardware", "data", "player", "online", "system", "development", "machine", "console", "developer", "design", "history", "technology", "standard", "information", "article", "example"];

    this.fillerWords = [
      "the", "and", "of", "to", "a", "in", "that", "it", "for", "on", "with", "as", "was", "at", "by", "an", "be", "this", "from", "which", "or", "but", "not", "are", "we", "is", "all", "yes", "no", "1", "3", "4"
    ];

    // 100 selected words.
    this.selectedWords = [];
  }

  generateHeader(chosenWords) {
    return "Article\t" + chosenWords.join("\t");
  }

  async getWordOccurences(folder, file, chosenWords) {
    const data = await fs.readFile(`${folder}/${file}`, "utf8");
    const words = data.split(" ");
    return chosenWords.map(word => words.filter(w => w === word).length);
  }

  async processFiles(chosenWords, useSelectedWords = false) {
    // Determine output file name based on word set
    const outputFilePath = useSelectedWords
      ? "./data/selectedWords_data.txt"
      : "./data/words_data.txt";
  
    // Initialize the file with a header
    const header = this.generateHeader(chosenWords);
    await fs.writeFile(outputFilePath, header + "\n");
  
    const gamesFolder = "./data/Wikipedia_clustering/Games";
    const programmingFolder = "./data/Wikipedia_clustering/Programming";
  
    const folders = [gamesFolder, programmingFolder];
  
    for (const folder of folders) {
      for (const file of await fs.readdir(folder)) {
        // Get word occurrences for the current file
        const occurrences = await this.getWordOccurences(folder, file, chosenWords);
  
        const row = [file, ...occurrences];

        await fs.appendFile(outputFilePath, row.join("\t") + "\n");
      }
    }
  
    console.log(`Processing completed. Output written to: ${outputFilePath}`);
  }

  // Returns top 10 words from a given file in a folder.
  async #getTopWordsFromFile(folder, file) {
    const data = await fs.readFile(`${folder}/${file}`, "utf8");
    const words = data.split(" ");

    // Use a Map to count the occurrences of each word
    const wordCounts = new Map();
    for (const word of words) {
        if (wordCounts.has(word)) {
            wordCounts.set(word, wordCounts.get(word) + 1);
        } else {
            wordCounts.set(word, 1);
        }
    }

    // Convert the Map to an array and sort it by word count in descending order
    const sortedWords = Array.from(wordCounts.entries())
        .sort((a, b) => b[1] - a[1])  // Sort by count in descending order
        .slice(0, 10);  // Get top 10 most common words

    return sortedWords;
  }

  async generateSelectedWords() {
    const gamesFolder = "./data/Wikipedia_clustering/Games";
    const programmingFolder = "./data/Wikipedia_clustering/Programming";

    let gamesTopWords = [];
    let programmingTopWords = [];

    // Set to track unique words
  const gamesWordsSet = new Set();
  const programmingWordsSet = new Set();

  for (const file of await fs.readdir(gamesFolder)) {
    const topWords = await this.#getTopWordsFromFile(gamesFolder, file);

    // Add top words to gamesTopWords only if they are not duplicates
    for (const [word, count] of topWords) {
      if (!gamesWordsSet.has(word)) {
        gamesTopWords.push({ word, count });
        gamesWordsSet.add(word);
      }
    }
  }

  for (const file of await fs.readdir(programmingFolder)) {
    const topWords = await this.#getTopWordsFromFile(programmingFolder, file);

    // Add top words to programmingTopWords only if they are not duplicates
    for (const [word, count] of topWords) {
      if (!programmingWordsSet.has(word)) {
        programmingTopWords.push({ word, count });
        programmingWordsSet.add(word);
      }
    }
  }

  // Filter filler words such as "the", "and", "of", etc.
  gamesTopWords = gamesTopWords.filter(word => !this.fillerWords.includes(word.word));
  programmingTopWords = programmingTopWords.filter(word => !this.fillerWords.includes(word.word));

  // Sort the top words by count in descending order
  gamesTopWords.sort((a, b) => b.count - a.count);
  programmingTopWords.sort((a, b) => b.count - a.count);
  
  // Get 50 words from each category
  gamesTopWords = gamesTopWords.slice(0, 50);
  programmingTopWords = programmingTopWords.slice(0, 50);

  this.selectedWords = gamesTopWords.concat(programmingTopWords).map(word => word.word);
  console.log("Selected words gathered successfully");
  return this.selectedWords;
  }
}