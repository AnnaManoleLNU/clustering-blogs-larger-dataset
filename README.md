# Clustering Wikipedia Articles

This project involves clustering Wikipedia articles about programming and games. The goal is to analyze how well the articles can be grouped based on their content.

## Overview  
I modified the clustering system to work with a dataset of 180 Wikipedia articles (90 about programming and 90 about games). The dataset can be downloaded from the [Datasets](https://coursepress.lnu.se/courses/web-intelligence/assignments/datasets) page.  

## Approach  
### **1. Word Frequency Calculation**  
Selected a set of keywords related to programming and games and calculated their frequency in each article. This reduces complexity and improves clustering performance.

### **2. Clustering**  
- **K-means clustering**: Grouped the 180 articles into two clusters. Checked if they were separated into programming and gaming clusters.  
- **Hierarchical clustering**: Performed hierarchical clustering to see if articles on similar topics formed clear branches.  

### **3. Word List Optimization**  
Created a custom word list with over 100 words and repeated the clustering process to compare results. The goal was to see if a more refined word list improved clustering accuracy.  

## Results  
- K-means clustering mostly separated the articles into programming and gaming clusters.  
- Hierarchical clustering showed meaningful grouping of similar topics.  
- The custom word list improved clustering accuracy, making topic separation more precise.  
