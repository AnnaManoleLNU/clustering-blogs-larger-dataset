import { useEffect, useState } from "react";
import { H1 } from "./components/typography/h1";
import { Button } from "@/components/ui/button";
import { H2 } from "./components/typography/h2";
import ArticleCategoryTitles from "./features/ArticleCategoryTitles";
import { Small } from "./components/typography/small";
import TreeView from "./features/TreeView";

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
  title: string;
  depth: number;
  children?: TreeNode[];
}

function App() {
  const [articles, setArticles] = useState<string[]>([]);
  const [clusters, setClusters] = useState<Cluster>({});
  const [isLoadingFixed, setIsLoadingFixed] = useState<boolean>(false);
  const [isLoadingFlexible, setIsLoadingFlexible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [treeMetrics, setTreeMetrics] = useState<{
    depth: number;
    totalNodes: number;
  }>({ depth: 0, totalNodes: 0 });
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
    setTreeData([]);
    const route =
      wordSelection === "words"
        ? "http://localhost:3000/clusters/hierarchical"
        : "http://localhost:3000/clusters/hierarchical-selected";
    const response = await fetch(route);
    const data = await response.json();
    const transformedData = transformData(data);
    setTreeData(transformedData);

    // Calculate metrics for the tree
    const metrics = calculateTreeMetrics(transformedData);
    setTreeMetrics(metrics);
  };

  const transformData = (
    data: TreeNode,
    parentId: string = "root",
    depth: number = 0
  ): TreeNode[] => {
    const nodeId = `${parentId}-${depth}`;

    // Recursively transform children if they exist
    const transformedChildren = (data.children || []).map(
      (child, index) => transformData(child, `${nodeId}-${index}`, depth + 1)[0] // Single child transformation
    );

    return [
      {
        id: nodeId,
        title: data.title,
        depth,
        children: transformedChildren,
      },
    ];
  };

  const calculateTreeMetrics = (
    tree: TreeNode[]
  ): { depth: number; totalNodes: number } => {
    const getDepth = (node: TreeNode): number => {
      if (!node.children || node.children.length === 0) return 1;
      return 1 + Math.max(...node.children.map(getDepth));
    };

    const getTotalNodes = (node: TreeNode): number => {
      if (!node.children || node.children.length === 0) return 1;
      return (
        1 + node.children.reduce((sum, child) => sum + getTotalNodes(child), 0)
      );
    };

    if (tree.length === 0) return { depth: 0, totalNodes: 0 };
    const root = tree[0];
    return { depth: getDepth(root), totalNodes: getTotalNodes(root) };
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
          <div>
            <H2 text={clusterName} className="-mb-2 !mt-2 border-b-0" />
            <Small text={articles.assignments.join(" ♦ ")} />
          </div>

          <div className="inline-flex gap-2 mt-2 text-primary bg-accent-foreground p-2 rounded-lg">
            <Small text={`Accuracy: ${articles.accuracy.toFixed(2)}%`} />
            <Small text={`Game count: ${articles.gameCount}`} />
            <Small text={`Programming count: ${articles.programmingCount}`} />
          </div>
        </div>
      ))}

      {treeData && treeData.length > 0 && (
        <div className="mt-2 inline-flex gap-2 text-primary bg-accent-foreground p-2 rounded-lg">
          <Small text={`Tree Depth: ${treeMetrics.depth} `} />
          <Small text={`Total Nodes: ${treeMetrics.totalNodes}`} />
        </div>
      )}

      <TreeView data={treeData} />
    </>
  );
}

export default App;
