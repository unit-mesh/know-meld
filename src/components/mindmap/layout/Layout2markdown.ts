import { Edge, Node } from "@xyflow/react";

export function layout2markdown(nodes: Node[], edges: Edge[]): string {
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  const edgeMap = new Map();
  edges.forEach(edge => {
    if (!edgeMap.has(edge.source)) {
      edgeMap.set(edge.source, []);
    }
    edgeMap.get(edge.source).push(edge.target);
  });

  function dfs(nodeId: string, level: number = 1): string {
    const node = nodeMap.get(nodeId);
    if (!node) return "";

    let markdown = "#".repeat(level) + " " + node.data.label + "\n";
    const children = edgeMap.get(nodeId) || [];
    children.forEach((childId: string) => {
      markdown += dfs(childId, level + 1);
    });
    return markdown;
  }

  const rootNodes = nodes.filter(node => !edges.some(edge => edge.target === node.id));
  return rootNodes.map(node => dfs(node.id)).join("\n");
}
