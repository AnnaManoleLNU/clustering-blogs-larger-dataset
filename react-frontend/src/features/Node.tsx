export default function Node({ node, style, dragHandle }) {
  /* This node instance can do many things. See the API reference. */
  return (
    <div style={style} ref={dragHandle}>
      {node.isLeaf ? "🍁" : "🗀"}
      {node.data.name}
    </div>
  );
}