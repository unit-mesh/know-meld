"use client";

import { Button } from "antd";
import React, { useCallback } from "react";
import { ConnectionLineType, Edge, Node, Position, useReactFlow } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';

interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

let newLabelId: number = 1;

export const ReactFlowContextMenu: React.FC<ContextMenuProps> = ({
                                                                   id,
                                                                   top,
                                                                   left,
                                                                   right,
                                                                   bottom,
                                                                   ...props
                                                                 }) => {
  const { t } = useTranslation();
  const { getNode, getEdges, setNodes, addNodes, setEdges } = useReactFlow();
  const node = getNode(id) as Node;

  const deleteNodeAndChildren = useCallback(() => {
    if (!node) return;

    const nodesToDelete = [node.id];
    const edges = getEdges();
    const children = edges.filter(edge => edge.source === node.id).map(edge => edge.target);

    const getAllChildren = (childIds: string[]) => {
      childIds.forEach(childId => {
        nodesToDelete.push(childId);
        const childEdges = edges.filter(edge => edge.source === childId).map(edge => edge.target);
        if (childEdges.length > 0) {
          getAllChildren(childEdges);
        }
      });
    };

    getAllChildren(children);

    setNodes(currentNodes => currentNodes.filter(n => !nodesToDelete.includes(n.id)));
    setEdges(currentEdges => currentEdges.filter(e => !nodesToDelete.includes(e.source) && !nodesToDelete.includes(e.target)));
  }, [getEdges, setNodes, setEdges]);

  const addChildNode = useCallback(() => {
    if (!node) return;

    newLabelId += 1;

    /// relayout and count new position
    const newId = uuidv4();
    const newNode: Node = {
      id: newId,
      data: { label: "New Node " + newLabelId },
      position: { x: node.position.x + 24, y: node.position.y + 24 },
      type: "editableNode",
      sourcePosition: Position.Right,
      targetPosition: Position.Left
    };

    addNodes(newNode);
    setEdges((currentEdges) => {
      const newEdge: Edge = {
        id: `edge-${id}-${newId}`,
        source: id,
        target: newId,
        type: ConnectionLineType.SimpleBezier,
        className: "shire-flow-edge",
        style: {
          stroke: node.style?.stroke || "#000",
        }
      };
      return [...currentEdges, newEdge];
    });
  }, []);

  // function getDisplay() {
  //   return node && node.data && node.data.label && node.data.label.substring(0, 4) + "...";
  // }

  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu flex flex-col p-2"
      {...props}
    >
      <Button type="primary"
              className={"mb-2"}
              icon={<PlusOutlined />}
              onClick={addChildNode}>
        {t("添加子节点")}
      </Button>
      <Button danger onClick={deleteNodeAndChildren}
              icon={<DeleteOutlined />}>
        {t("删除节点")}
      </Button>
    </div>
  );
};
