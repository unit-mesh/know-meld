import { Input } from "antd";
import React, { useCallback, useState } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";

type TextNodeProps = {
  isConnectable: boolean;
  id: string;
  data: { label: string; };
};

function ReactFlowEditableNode({ data, id }: TextNodeProps) {
  const { setNodes, getNodes } = useReactFlow();

  const [label, setLabel] = useState<string>(data.label);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleDoubleClick = useCallback((): void => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback((): void => {
    setIsEditing(false);
  }, [label, data]);

  const handleKeyDown = useCallback((evt: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (evt.key === "Enter" || evt.key === "Escape") {
      setIsEditing(false);
    }

    if (evt.key === "Enter") {
      setNodes(getNodes().map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label,
            },
          };
        }
        return node;
      }));
    }
  }, [label, data, setNodes, getNodes]);

  const handleChange = useCallback((evt: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setLabel(evt.target.value);
  }, []);

  return (
    <div className="editable-node" onDoubleClick={handleDoubleClick}>
      <Handle type="target" position={Position.Left}
              style={{ width: "1px", height: "1px", minHeight: "1px", minWidth: "1px", border: "none" }} />
      {isEditing ? (
        <Input.TextArea
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{ fontSize: "16px", fontFamily: "Arial", width: "100%", cursor: "text" }}
        />
      ) : (
        <div className="font-medium display-node" style={{ fontSize: "16px", cursor: "default"}}>
          <span>{label}</span>
        </div>
      )}
      <Handle type="source" position={Position.Right}
              style={{ width: "1px", height: "1px", minHeight: "1px", minWidth: "1px", border: "none" }} />
    </div>
  );
}

export default ReactFlowEditableNode;
