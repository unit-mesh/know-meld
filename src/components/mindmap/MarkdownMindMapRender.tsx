"use client";

import React, { type MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  NodeChange,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { MindMap } from "@/utils/markdown/mindmap/MindMap";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

import { ReactFlowContextMenu } from "@/components/mindmap/ui/ReactFlowContextMenu";
import { getLayoutedElements, markdown2Layout } from "@/components/mindmap/layout/Markdown2DagreTree";
import ReactFlowEditableNode from "@/components/mindmap/ui/ReactFlowEditableNode";
import { layout2markdown } from "@/components/mindmap/layout/Layout2markdown";

export type MarkdownMindMapProps = {
  content: string;
  onChange?: (content: string) => void;
};

const nodeTypes = {
  editableNode: ReactFlowEditableNode,
};

export default function MarkdownMindMapRender({ content, onChange }: MarkdownMindMapProps) {
  const { t } = useTranslation();
  const [markdown, setMarkdown] = useState(content);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [menu, setMenu] = useState<any>(null);
  const ref = useRef<any>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const onConnect = useCallback((params: Edge | Connection) => {
    setEdges((eds) => {
      const newEdges = addEdge(params, eds);
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, newEdges);
      setNodes(layoutedNodes as any);
      return layoutedEdges as any;
    });
  }, [setEdges, nodes, setNodes]);

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = markdown2Layout(markdown);
    setNodes(newNodes as any);
    setEdges(newEdges as any);
  }, [markdown]);

  const onNodesChangeWithMarkdownUpdate = useCallback((changes: NodeChange<never>[]) => {
    onNodesChange(changes);
    setNodes((currentNodes) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(currentNodes, edges);
      const newMarkdown = layout2markdown(currentNodes, edges);
      onChange?.(newMarkdown);

      return layoutedNodes as any;
    });
  }, [onNodesChange, nodes, edges, onChange]);

  const onEdgesChangeWithMarkdownUpdate = useCallback((changes: EdgeChange<never>[]) => {
    onEdgesChange(changes);
  }, [onEdgesChange, setEdges]);

  const onNodeContextMenu = useCallback((event: ReactMouseEvent, node: Node) => {
      event.preventDefault();
      const pane = ref.current?.getBoundingClientRect();
      const offset = elementRef.current?.getBoundingClientRect();

      setMenu({
        id: node.id,
        top: event.clientY < pane.height && event.clientY - (offset?.top || 0),
        left: event.clientX < pane.width && event.clientX - (offset?.left || 0),
        right: event.clientX >= pane.width && pane.width - event.clientX + (offset?.left || 0),
        bottom: event.clientY >= pane.height && pane.height - event.clientY + (offset?.top || 0),
      });
    },
    [setMenu],
  );

  const onPaneClick = useCallback(() => {
    setMenu(null);
  }, [setMenu]);

  const onError = (msgId: string, msg: any) => {
    if (msgId === "002") {
      return;
    }

    console.warn(msg);
  };

  const handleDownload = useCallback(() => {
    try {
      const xmlContent = MindMap.fromMarkdownHeader(markdown).toXML();
      const blob = new Blob([xmlContent], { type: "application/x-freemind" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mindmap.mm";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating XML:", error);
      alert("An error occurred while generating the XML file. Please try again.");
    }
  }, [markdown]);

  return (
    <div ref={elementRef} className="flex flex-col h-screen w-full">
      <div className="flex flex-col h-screen w-full">
        <div className="w-full flex flex-col">
          <div className="flex items-center justify-end">
            <Button type="primary" onClick={() => handleDownload()}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              {t("download")}（.mm）
            </Button>
          </div>
          <div className="border rounded mt-4" style={{ height: "960px" }}>
            <ReactFlowProvider>
              <ReactFlow
                onError={onError}
                ref={ref}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChangeWithMarkdownUpdate}
                onEdgesChange={onEdgesChangeWithMarkdownUpdate}
                onConnect={onConnect}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.1}
                maxZoom={1.5}
                nodeTypes={nodeTypes}
                onPaneClick={onPaneClick}
                onNodeContextMenu={onNodeContextMenu}
              >
                <Background />
                <Controls />
                {menu && <ReactFlowContextMenu onClick={onPaneClick} {...menu} />}
              </ReactFlow>
            </ReactFlowProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
