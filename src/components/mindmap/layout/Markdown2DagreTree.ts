import { ConnectionLineType, Edge, Node, Position } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import dagre from "dagre";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { Node as UnistNode } from "unist";
import * as d3 from 'd3';

const nodeHeight = 20;
const maxWidth = 320;

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

function dagreLayout(nodes: (Node)[], edges: (Edge)[], direction: string = "LR") {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: maxWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      position: {
        x: nodeWithPosition.x - maxWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
}

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  return dagreLayout(nodes, edges);
};

function headerToNetwork(markdown: string) {
  console.warn("markdown2Layout should only be called once");
  const tree = unified().use(remarkParse).parse(markdown);
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const lastNodeAtLevel: { [key: number]: string } = {};
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  const secondaryNodeColors: { [key: string]: string } = {};
  let currentSecondaryParentId: string | null = null;

  visit(tree, "heading", (node: UnistNode) => {
    const level = (node as any).depth;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const label = (node.children[0] as any).value;
    const id = uuidv4();
    const parentId = lastNodeAtLevel[level - 1];

    if (level === 2) {
      currentSecondaryParentId = id;
      secondaryNodeColors[id] = colorScale(id);
    }

    nodes.push({
      id,
      data: { label },
      position: { x: 0, y: 0 },
      type: "editableNode",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        stroke: secondaryNodeColors[currentSecondaryParentId || ""] || "#000",
      },
    });

    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${id}`,
        source: parentId,
        target: id,
        type: ConnectionLineType.SimpleBezier,
        style: {
          stroke: secondaryNodeColors[currentSecondaryParentId || ""] || "#000",
        },
      });
    }

    lastNodeAtLevel[level] = id;
  });
  return { nodes, edges };
}

export function markdown2Layout(markdown: string): { nodes: Node[], edges: Edge[] } {
  const { nodes, edges } = headerToNetwork(markdown);
  return getLayoutedElements(nodes, edges) as any;
}
