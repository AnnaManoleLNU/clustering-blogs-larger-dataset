# Project


<!----------------------------------------------------------------------------->
<details>
  <summary><h2>P2 - Clustering</h2></summary>

This is one of the pre-defined project ideas you can choose for your project.

### Clustering Wikipedia articles

Modify your clustering system from Assignment 2 to use Wikipedia articles (90 articles about Programming, 90 about Games). The dataset can be downloaded on the [Datasets](https://coursepress.lnu.se/courses/web-intelligence/assignments/datasets) page.

To use the dataset for clustering, you need to select some words and calculate the frequency of these words in each Wikipedia article. It is not recommended to use all words from the articles since similarity calculations will then take a long time. You can, for example, use the following words:

`language, programming, computer, software, hardware, data, player, online, system, development, machine, console, developer, design, history, technology, standard, information, article, example`

The article *Arcade_game* would then have the following frequencies:

`0;4;14;1;58;1;11;7;12;4;9;17;0;5;33;8;1;2;7;1`

### Grading

<table>
  <tr>
    <th>Grade</th>
    <th>Requirements</th>
  </tr>
  <tr>
    <td>E</td>
    <td>
      <ul>
        <li>Read all articles about programming and games and convert each article to word frequencies using the word list above.</li>
        <li>Perform k-means clustering on the 180 articles using two clusters.</li>
        <li>Are the articles well separated into one cluster of gaming related articles and one cluster about programming?</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>C-D</td>
    <td>
      <ul>
        <li>Perform hierarchical clustering on the 180 articles.</li>
        <li>Are articles about similar topics well separated into branches?</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>A-B</td>
    <td>
      <ul>
        <li>Generate your own word list of at least 100 words.</li>
        <li>Repeat k-means and hierarchical clustering using the new word list.</li>
        <li>Are the results better with the new word list?</li>
      </ul>
    </td>
  </tr>
</table>
</details>

<!----------------------------------------------------------------------------->
<details>
  <summary><h2>P3 - Text Classification</h2></summary>

This is one of the pre-defined project ideas you can choose for your project.



<table>
  <tr>
    <th>Grade</th>
    <th>Requirements</th>
  </tr>
  <tr>
    <td>E</td>
    <td>
      <ul>
        <li>Scrape and store raw HTML for at least 200 pages.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>C-D</td>
    <td>
      <ul>
        <li>Parse the raw HTML files to generate a dataset similar to the Wikipedia dataset from Assignment 3.</li>
        <li>For each article, the dataset shall contain a file with all words in the article and another file with all outgoing links in the article.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>A-B</td>
    <td>
      <ul>
        <li>Use the dataset with your search engine from Assignment 3.</li>
        <li>Use both content-based ranking and PageRank to rank search results.</li>
      </ul>
    </td>
  </tr>
</table>
</details>
