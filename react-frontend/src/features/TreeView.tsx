import { useState } from "react";

// Define types for TreeNode and TreeViewProps
interface TreeNode {
  id: string;
  title: string;
  depth: number;
  children?: TreeNode[];
}

interface TreeViewProps {
  data: TreeNode[];
}

// TreeView Component
export default function TreeView({ data }: TreeViewProps) {
  const [openNodes, setOpenNodes] = useState<Record<string, boolean>>(
    () => Object.fromEntries(data.map((node) => [node.id, true])) // Initialize all nodes as open
  );

  const toggleNode = (id: string) => {
    setOpenNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="tree-view">
      {data.map((node) => (
        <div
          key={node.id}
          style={{
            marginLeft: `${node.depth * 4}px`,
            display: "flex flex-row",
          }}
        >
          {node.children && node.children.length > 0 ? (
            <span
              onClick={() => toggleNode(node.id)}
              className="mr-2 cursor-pointer"
            >
              {openNodes[node.id] ? "📂" : "📁"}
            </span>
          ) : (
            <span className="mr-2">📄</span>
          )}
          <span>{node.title}</span>
          {openNodes[node.id] && node.children && (
            <TreeView data={node.children} />
          )}
        </div>
      ))}
    </div>
  );
}
