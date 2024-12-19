import { useEffect, useState } from "react";
import { H1 } from "./components/typography/h1";
import { P } from "./components/typography/p";
import { Button } from "@/components/ui/button";
import { H2 } from "./components/typography/h2";
import { Tree } from "react-arborist";

interface Cluster {
  [key: string]: string[];
}

interface TreeNode {
  id: string;
  title?: string;
  children?: TreeNode[];
}

function App() {
  const [blogs, setBlogs] = useState<string[]>([]);
  const [clusters, setClusters] = useState<Cluster>({});
  const [isLoadingFixed, setIsLoadingFixed] = useState<boolean>(false);
  const [isLoadingFlexible, setIsLoadingFlexible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  const fetchBlogTitles = async () => {
    const response = await fetch("http://localhost:3000/blogs");
    const data = await response.json();
    setBlogs(data);
  };

  useEffect(() => {
    fetchBlogTitles();
  }, []);

  const clusterBlogsFixedIterations = async () => {
    if (isLoadingFixed) return;
    setIsLoadingFixed(true);
    setTreeData([]);
    const response = await fetch("http://localhost:3000/clusters/kfixed");
    const data = await response.json();
    setIsLoadingFixed(false);
    setClusters(data);
  };

  const clusterBlogsFlexibleIterations = async () => {
    if (isLoadingFlexible) return;
    setIsLoadingFlexible(true);
    setTreeData([]);
    const response = await fetch("http://localhost:3000/clusters/kflexible");
    const data = await response.json();
    setIsLoadingFlexible(false);
    setClusters(data);
  };

  const transformData = (
    data: { title?: string; children: [] },
    idPrefix = "node"
  ): TreeNode[] => {
    const transformedChildren =  data.children.map(
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

  const clusterBlogsHierarchical = async () => {
    setClusters({});
    const response = await fetch("http://localhost:3000/clusters/hierarchical");
    const data = await response.json();
    const transformedData = transformData(data);
    setTreeData(transformedData);
  };

  return (
    <>
      <H1 text="Blogs available" />
      <P text={blogs.join(" ♦ ")} />

      <div className="flex gap-2 mt-4 mb-4">
        <Button onClick={clusterBlogsFixedIterations} disabled={isLoadingFixed}>
          Cluster blogs fixed iterations (10)
        </Button>
        <Button
          onClick={clusterBlogsFlexibleIterations}
          disabled={isLoadingFlexible}
        >
          Cluster blogs flexible iterations
        </Button>
        <Button onClick={clusterBlogsHierarchical}>
          Cluster blogs hierarchically
        </Button>
      </div>

      {Object.entries(clusters).map(([clusterName, blogs]) => (
        <div key={clusterName}>
          <H2 text={clusterName} className="-mb-2 !mt-2 border-b-0" />
          <ul>
            {blogs.map((blog, index) => (
              <li key={index}>{blog}</li>
            ))}
          </ul>
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
