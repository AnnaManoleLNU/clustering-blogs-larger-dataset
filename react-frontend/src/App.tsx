import { useEffect, useState } from "react";
import { H1 } from "./components/typography/h1";
import { Button } from "@/components/ui/button";
import { H2 } from "./components/typography/h2";
import { Tree } from "react-arborist";
import ArticleCategoryTitles from "./features/ArticleCategoryTitles";
import { Small } from "./components/typography/small";

interface Cluster {
  [key: string]: {
    assignments: string[];
    accuracy: number;
    gameCount: number;
    programmingCount: number;
  };
}

interface TreeNode {
  id: string;
  title?: string;
  children?: TreeNode[];
}

function App() {
  const [articles, setArticles] = useState<string[]>([]);
  const [clusters, setClusters] = useState<Cluster>({});
  const [isLoadingFixed, setIsLoadingFixed] = useState<boolean>(false);
  const [isLoadingFlexible, setIsLoadingFlexible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [wordSelection, setWordSelection] = useState<string>("words"); // Dropdown state

  const fetchArticleTitles = async () => {
    const response = await fetch("http://localhost:3000/articles");
    const data = await response.json();
    setArticles(data);
  };

  useEffect(() => {
    fetchArticleTitles();
  }, []);

  const clusterArticlesFixedIterations = async () => {
    if (isLoadingFixed) return;
    setIsLoadingFixed(true);
    setTreeData([]);
    const route =
      wordSelection === "words"
        ? "http://localhost:3000/clusters/kfixed"
        : "http://localhost:3000/clusters/kfixed-selected";
    const response = await fetch(route);
    const data = await response.json();
    setIsLoadingFixed(false);
    setClusters(data);
  };

  const clusterArticlesFlexibleIterations = async () => {
    if (isLoadingFlexible) return;
    setIsLoadingFlexible(true);
    setTreeData([]);
    const route =
      wordSelection === "words"
        ? "http://localhost:3000/clusters/kflexible"
        : "http://localhost:3000/clusters/kflexible-selected";
    const response = await fetch(route);
    const data = await response.json();
    setIsLoadingFlexible(false);
    setClusters(data);
  };

  const clusterArticlesHierarchical = async () => {
    setClusters({});
    const route =
      wordSelection === "words"
        ? "http://localhost:3000/clusters/hierarchical"
        : "http://localhost:3000/clusters/hierarchical-selected";
    const response = await fetch(route);
    const data = await response.json();
    const transformedData = transformData(data);
    setTreeData(transformedData);
  };

  const transformData = (
    data: { title?: string; children: [] },
    idPrefix = "node"
  ): TreeNode[] => {
    const transformedChildren = data.children.map(
      (child: { title?: string; children: [] }, index: number) => ({
        id: `${idPrefix}-${index}`,
        title: child.title || "",
        children: child.children?.length
          ? transformData(child, `${idPrefix}-${index}`)
          : [],
      })
    );

    return [
      {
        id: `${idPrefix}-root`,
        title: "",
        children: transformedChildren,
      },
    ];
  };

  return (
    <>
      <H1 text="Articles available" />

      <ArticleCategoryTitles
        title="Gaming articles"
        articleTitles={articles.slice(0, 90).join(" ♦ ")}
      />

      <ArticleCategoryTitles
        title="Programming articles"
        articleTitles={articles.slice(90, 180).join(" ♦ ")}
      />

      <div className="flex gap-2 mt-4 mb-4">
        {/* Dropdown for Word Selection */}
        <select
          value={wordSelection}
          onChange={(e) => setWordSelection(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="words">Default Words</option>
          <option value="selectedWords">Selected Words</option>
        </select>

        <Button
          onClick={clusterArticlesFixedIterations}
          disabled={isLoadingFixed}
        >
          Cluster articles fixed iterations (10)
        </Button>
        <Button
          onClick={clusterArticlesFlexibleIterations}
          disabled={isLoadingFlexible}
        >
          Cluster articles flexible iterations
        </Button>
        <Button onClick={clusterArticlesHierarchical}>
          Cluster articles hierarchically
        </Button>
      </div>

      {Object.entries(clusters).map(([clusterName, articles]) => (
        <div key={clusterName}>
          <H2 text={clusterName} className="-mb-2 !mt-2 border-b-0" />
          <Small text={articles.assignments.join(" ♦ ")} />

          <div className="flex gap-2 mt-2 bg-primary p-2 rounded-lg">
            <Small text={`Accuracy: ${articles.accuracy.toFixed(2)}%`} />
            <Small text={`Game count: ${articles.gameCount}`} />
            <Small text={`Programming count: ${articles.programmingCount}`} />
          </div>
        </div>
      ))}

      <Tree
        data={treeData}
        width={1800}
        indent={20}
        rowHeight={30}
        children={({ node, style }) => (
          <div style={style}>
            {node.children && node.children.length > 0 ? (
              <span
                role="img"
                aria-label={node.isOpen ? "folder-open" : "folder-closed"}
                onClick={() => node.toggle()}
                className="mr-2 cursor-pointer"
              >
                {node.isOpen ? "📂" : "📁"}
              </span>
            ) : (
              <span role="img" aria-label="file" className="mr-2">
                📄
              </span>
            )}
            <span>{node.data.title}</span>
          </div>
        )}
      />
    </>
  );
}

export default App;
